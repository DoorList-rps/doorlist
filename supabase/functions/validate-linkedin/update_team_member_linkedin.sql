CREATE OR REPLACE FUNCTION update_team_member_linkedin(p_name text, p_linkedin_url text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE sponsors
  SET team_members = (
    SELECT jsonb_agg(
      CASE
        WHEN (value->>'name') = p_name THEN 
          jsonb_set(value, '{linkedin_url}', to_jsonb(p_linkedin_url))
        ELSE value
      END
    )
    FROM jsonb_array_elements(team_members)
  )
  WHERE team_members @> jsonb_build_array(jsonb_build_object('name', p_name));
END;
$$;