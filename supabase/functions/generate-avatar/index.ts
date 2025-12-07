import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AVATAR_GENERATION_PROMPT = `You are given:
1. A user photo.
2. The user's name.
3. A stamp image (PNG).

Generate a final ETHMumbai-style avatar that includes Mumbai + Thane elements, a denser artistic background, and a clean cartoon version of the user.

------------------------------------------------------
CANVAS & SIZE
------------------------------------------------------
- Output must be a perfect square (1:1), around 1500 × 1500 px.
- Center the character clearly.

------------------------------------------------------
STEP 1 — PERSON EXTRACTION & CARTOON STYLE
------------------------------------------------------
Extract the person from the photo:
- Remove background cleanly.
- Preserve key physical features (face shape, hair, glasses, beard, clothing).
- Convert them into a clean, attractive cartoon avatar:
  - Smooth outlines.
  - Flat bright colors with soft shading.
  - Natural proportions (not anime, not chibi).
  - Expression: simple friendly smile.
  - Make the avatar neat, clear, confident, and appealing.

------------------------------------------------------
STEP 2 — ETHMUMBAI + THANE BACKDROP (DENSE & BEAUTIFUL)
------------------------------------------------------
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

------------------------------------------------------
STEP 3 — USER NAME
------------------------------------------------------
- Add the user's name in white bold sans-serif text.
- Place it in the bottom-left corner.
- Keep it clean, minimal, and well-spaced.

------------------------------------------------------
STEP 4 — STAMP OVERLAY (IMPORTANT)
------------------------------------------------------
Use the provided stamp PNG EXACTLY as given.

- Place it in the BOTTOM-RIGHT corner.
- Rotate the stamp by ~20–30 degrees counter-clockwise.
- Crop it so ~70–80% of the stamp is visible inside the frame.
- Keep the stamp sharp and high contrast.
- It should feel like a postal seal applied over the artwork.

------------------------------------------------------
FINAL STYLE RULES
------------------------------------------------------
- Cartoon avatar centered and clear.
- Dense Mumbai + Thane background icons in bright white.
- Prominent double-decker bus outline.
- Multiple vada pav and chai icons for cultural vibe.
- A beautifully messy pattern: lively, energetic, vibrant.
- Consistent ETHMumbai-style aesthetic.

------------------------------------------------------
OUTPUT
------------------------------------------------------
- High-resolution square PNG.
- Balanced composition of person, icons, name, and stamp.`;

const PASSPORT_GENERATION_PROMPT = `You are given:
1. A user photo.
2. The user's name.
3. A stamp image (PNG).

Your task is to generate a complete ETHMumbai Passport page in the exact format shown below.

------------------------------------------------------
PASSPORT LAYOUT REQUIREMENTS
------------------------------------------------------
The final image must look like a realistic passport page with the following structure:

LEFT SIDE (PHOTO SECTION):
- Create a clean cartoon avatar of the person from the provided image.
- Extract the person and convert them into a neat, professional cartoon style with:
  - Smooth outlines
  - Friendly smile
  - Natural proportions (not anime)
  - Simple soft shadows and minimal shading
- Place the avatar inside a large vertical rectangular frame on the left side.
- Use a light gray or cream background behind the avatar.
- Add a faint drop shadow under the feet (optional but subtle).
- Do NOT add Mumbai icons here.

RIGHT SIDE (PASSPORT INFORMATION):
Reproduce the exact passport layout:

Title at top:
- "PASSPORT"
- "REPUBLIC OF ETHMUMBAI"

Add these fields, aligned vertically with consistent spacing:

Type: P  
Code: ETH  
Passport No.: E12345678  

Surname: {USER NAME}  
Given Names: {USER NAME}  
Nationality: ETHMUMBAI  

Date of Birth: 01 JAN 2000  
Sex: M  
Place of Birth: MUMBAI  

Date of Issue: 01 JAN 2024  
Date of Expiry: 01 JAN 2034  

Typography rules:
- Titles in uppercase bold black.
- Other fields in clean passport-style sans-serif font.
- Perfect alignment and spacing like an actual passport.

BACKGROUND:
- Use an off-white / light cream passport background.
- Add faint guilloché lines or micro-pattern texture similar to real passports.
- Keep it subtle and professional.

------------------------------------------------------
BOTTOM SECTION (MRZ ZONE)
------------------------------------------------------
Add a machine-readable zone with two lines in pure black monospace font:

Line 1:
{USER NAME}<<{USER NAME}<<<<<<<<<<<<<<<<<

Line 2:
01234567801JANJ002024<<<<<<<<2034

Format spacing exactly like real passports.

------------------------------------------------------
STAMP PLACEMENT
------------------------------------------------------
Use the provided red ETHMumbai stamp image exactly as given:

- Place it overlapping the bottom center of the passport.
- Tilt the stamp by ~20–30 degrees counter-clockwise.
- Keep the stamp at partial opacity so it appears like real ink.
- Do NOT fully cover the text—place it naturally like a verification seal.

------------------------------------------------------
STYLE RULES
------------------------------------------------------
- Everything must look clean, official, and realistic.
- Use accurate passport spacing and typography.
- Avatar must look professional and consistent.
- No distracting elements or extra graphics.

------------------------------------------------------
OUTPUT
------------------------------------------------------
- Full passport page as a single high-resolution image.
- All text, MRZ lines, avatar, layout, and stamp must match the example format.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, photo, type = "avatar", stamp } = await req.json();

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

    console.log("===========================================");
    console.log("🔔 GENERATION REQUEST RECEIVED");
    console.log("📋 Type requested:", type);
    console.log("👤 Name:", name);
    console.log("🖼️ Stamp provided:", !!stamp);
    console.log("===========================================");

    // Select the appropriate prompt based on type
    const prompt = type === "passport" ? PASSPORT_GENERATION_PROMPT : AVATAR_GENERATION_PROMPT;

    if (type === "passport") {
      console.log("✅ SELECTED: PASSPORT GENERATION");
      console.log("📄 Expected: HORIZONTAL RECTANGLE (2000x1400)");
      console.log("📄 Expected: CREAM background with text fields");
    } else {
      console.log("✅ SELECTED: AVATAR GENERATION");
      console.log("🟥 Expected: SQUARE (1500x1500)");
      console.log("🟥 Expected: RED background with white icons");
    }
    console.log("📝 Prompt first 150 chars:", prompt.substring(0, 150).replace(/\n/g, " "));

    // Build content array with text, photo, and stamp
    // Add explicit type instructions at the beginning and end
    const typeInstruction = type === "passport"
      ? "\n\n🚨 CRITICAL: You MUST create a HORIZONTAL PASSPORT DOCUMENT, NOT a square poster! 🚨\n"
      : "\n\n🚨 CRITICAL: You MUST create a SQUARE RED POSTER (1:1), NOT a horizontal document! 🚨\n";

    const content = [
      {
        type: "text",
        text: `${typeInstruction}${prompt}\n\nUser's name: ${name}\n\n${typeInstruction}`,
      },
      {
        type: "image_url",
        image_url: {
          url: photo,
        },
      },
    ];

    // Add stamp if available
    if (stamp) {
      content.push({
        type: "image_url",
        image_url: {
          url: stamp,
        },
      });
    } else {
      console.warn("No stamp image provided");
    }

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
            role: "system",
            content: type === "passport"
              ? "You are a professional passport document generator. Create realistic passport pages with proper layout, typography, and official formatting. Include the user's cartoon avatar, all passport fields, MRZ zone, and stamp overlay as specified."
              : "You are an artistic poster designer specializing in cultural avatars. Create vibrant square posters with red backgrounds, white line-art Mumbai/Thane landmarks, cartoon avatars, user names, and stamp overlays in the ETHMumbai style."
          },
          {
            role: "user",
            content,
          },
        ],
        modalities: ["image", "text"],
        temperature: 0.3, // Lower temperature for more consistent, instruction-following output
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

    const fileName = `${type}-${Date.now()}-${name.toLowerCase().replace(/\s+/g, "-")}.png`;

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