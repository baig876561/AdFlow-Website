import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function patch() {
  console.log("Patching Database...");

  // 1. Remove Ford Mustang ad from homepage (unfeature and unpublish it)
  const { error: err1 } = await supabase
    .from("ads")
    .update({ status: "Archived", is_featured: false })
    .ilike("title", "%Ford Mustang%");
  if (err1) console.error("Error archiving Mustang:", err1);
  else console.log("Removed Ford Mustang from landing page.");

  // 2. Publish and Feature the Tesla ad
  const { error: err2 } = await supabase
    .from("ads")
    .update({ status: "Published", is_featured: true, publish_at: new Date().toISOString() })
    .ilike("title", "%Tesla%");
  if (err2) console.error("Error publishing Tesla:", err2);
  else console.log("Added Tesla to landing page.");

  // 3. Publish and Feature the Skincare ad
  const { error: err3 } = await supabase
    .from("ads")
    .update({ status: "Published", is_featured: true, publish_at: new Date().toISOString() })
    .ilike("title", "%Skincare%");
  if (err3) console.error("Error publishing Skincare:", err3);
  else console.log("Added Skincare to landing page.");

  console.log("Database patching complete!");
}

patch();
