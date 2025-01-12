CREATE OR REPLACE FUNCTION update_past_deal_info(
  p_name text,
  p_website_url text,
  p_image_url text,
  p_location text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE sponsors
  SET past_deals = (
    SELECT jsonb_agg(
      CASE
        WHEN (value->>'name') = p_name THEN 
          jsonb_set(
            jsonb_set(
              jsonb_set(value, '{website_url}', to_jsonb(p_website_url)),
              '{image_url}', to_jsonb(p_image_url)
            ),
            '{location}', to_jsonb(p_location)
          )
        ELSE value
      END
    )
    FROM jsonb_array_elements(past_deals)
  )
  WHERE past_deals @> jsonb_build_array(jsonb_build_object('name', p_name));
END;
$$;