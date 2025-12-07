import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AVATAR_GENERATION_PROMPT = `You are given:
1. A user photo.
2. The user's name.

Generate a final ETHMumbai-style avatar that includes Mumbai + Thane elements, a denser artistic background, and a clean cartoon version of the user.

CANVAS & SIZE:
- Output must be a perfect square (1:1), around 1500 × 1500 px.
- Center the character clearly.

STEP 1 — PERSON EXTRACTION & CARTOON STYLE:
Extract the person from the photo:
- Remove background cleanly.
- Preserve key physical features (face shape, hair, glasses, beard, clothing).
- Convert them into a clean, attractive cartoon avatar:
  - Smooth outlines.
  - Flat bright colors with soft shading.
  - Natural proportions (not anime, not chibi).
  - Expression: simple friendly smile.
  - Make the avatar neat, clear, confident, and appealing.

STEP 2 — ETHMUMBAI + THANE BACKDROP (DENSE & BEAUTIFUL):
Use BEST Red (#E2231A) as the background.

Add many bright white (#FFFFFF) line-art elements arranged in a dense, artistic, slightly messy but visually beautiful pattern.

Include ALL of the following landmark and cultural icons:

MUMBAI ICONS:
- Gateway of India
- CST / Victoria Terminus
- Bandra–Worli Sea Link
- Marine Drive curvature with tetrapods
- Mumbai skyline high-rise buildings
- Mumbai Metro train
- Auto rickshaw
- BEST DOUBLE-DECKER BUS (large and prominent)
- Cutting chai glass
- Dabbawala tiffin
- VADA PAV icons (multiple, scattered)

THANE ICONS:
- Thane Creek bridge silhouette
- Upvan Lake outline / waterfront lines
- Thane skyline buildings

BACKGROUND STYLE RULES:
- Icons must have consistent thin stroke width.
- Arrange icons in a dense, slightly chaotic but aesthetically pleasing pattern.
- Allow some layering and overlap in the background, but not covering the character.
- Keep the entire background full, energetic, and culturally rich.
- No gradients, no realistic textures, no shadows — purely line art.

STEP 3 — USER NAME:
- Add the user's name in white bold sans-serif text.
- Place it in the bottom-left corner.
- Keep it clean, minimal, and well-spaced.

FINAL STYLE RULES:
- Cartoon avatar centered and clear.
- Dense Mumbai + Thane background icons in bright white.
- Prominent double-decker bus outline.
- Multiple vada pav and chai icons for cultural vibe.
- A beautifully messy pattern: lively, energetic, vibrant.
- Consistent ETHMumbai-style aesthetic.

OUTPUT:
- High-resolution square PNG.
- Balanced composition of person, icons, and name.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, photo } = await req.json();

    if (!name || !photo) {
      return new Response(
        JSON.stringify({ error: "Name and photo are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating avatar for:", name);

    // Call Lovable AI Gateway with Gemini image generation model
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `${AVATAR_GENERATION_PROMPT}\n\nThe user's name is: ${name}`,
              },
              {
                type: "image_url",
                image_url: {
                  url: photo,
                },
              },
            ],
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received");

    // Extract the generated image
    const generatedImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!generatedImage) {
      console.error("No image in response:", JSON.stringify(data));
      throw new Error("No image generated");
    }

    // Upload to Supabase Storage
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Convert base64 to blob
    const base64Data = generatedImage.replace(/^data:image\/\w+;base64,/, "");
    const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

    const fileName = `avatar-${Date.now()}-${name.toLowerCase().replace(/\s+/g, "-")}.png`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, imageBytes, {
        contentType: "image/png",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error("Failed to upload image");
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
    const publicUrl = urlData.publicUrl;

    // Save to database
    const { error: dbError } = await supabase.from("avatars").insert({
      name,
      generated_image_url: publicUrl,
    });

    if (dbError) {
      console.error("Database error:", dbError);
    }

    console.log("Avatar generated and saved:", publicUrl);

    return new Response(
      JSON.stringify({ imageUrl: publicUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-avatar:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});