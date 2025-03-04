
-- This SQL file is for reference only. Run these commands in the SQL editor in the Supabase dashboard.

-- Create function to notify webhook (If it doesn't exist already)
CREATE OR REPLACE FUNCTION public.notify_webhook()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Add more detailed error handling and logging
  BEGIN
    PERFORM
      pg_net.http_post(
        url := 'https://iavmizyezxogctfrbvxh.functions.supabase.co/profile-webhook',
        body := json_build_object(
          'type', TG_OP,
          'table', TG_TABLE_NAME,
          'schema', TG_TABLE_SCHEMA,
          'record', row_to_json(NEW),
          'old_record', CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE null END
        )::text
      );
    EXCEPTION WHEN OTHERS THEN
      -- Log the error but don't prevent the trigger from completing
      RAISE NOTICE 'Error in notify_webhook: %', SQLERRM;
    END;
  RETURN NEW;
END;
$$;

-- Create trigger for INSERT events on profiles
CREATE TRIGGER webhook_profiles
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION notify_webhook();

-- Create trigger for UPDATE events on profiles
CREATE TRIGGER webhook_profiles_update
AFTER UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION notify_webhook();
