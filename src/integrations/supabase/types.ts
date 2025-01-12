export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author: string | null
          content: string
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      investment_inquiries: {
        Row: {
          created_at: string
          id: string
          investment_id: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          investment_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          investment_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "investment_inquiries_investment_id_fkey"
            columns: ["investment_id"]
            isOneToOne: false
            referencedRelation: "investments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investment_inquiries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      investments: {
        Row: {
          accredited_only: boolean | null
          approved: boolean | null
          closing_date: string | null
          created_at: string
          description: string | null
          distribution_frequency: string | null
          equity_remaining: number | null
          hero_image_url: string | null
          hold_period: string | null
          id: string
          investment_type: string | null
          investment_url: string | null
          location_city: string | null
          location_country: string | null
          location_state: string | null
          location_street: string | null
          location_zip: string | null
          minimum_investment: number | null
          name: string
          property_type: string | null
          short_description: string | null
          slug: string
          sponsor_id: string | null
          sponsor_name: string | null
          status: string | null
          target_return: string | null
          total_equity: number | null
          updated_at: string
        }
        Insert: {
          accredited_only?: boolean | null
          approved?: boolean | null
          closing_date?: string | null
          created_at?: string
          description?: string | null
          distribution_frequency?: string | null
          equity_remaining?: number | null
          hero_image_url?: string | null
          hold_period?: string | null
          id?: string
          investment_type?: string | null
          investment_url?: string | null
          location_city?: string | null
          location_country?: string | null
          location_state?: string | null
          location_street?: string | null
          location_zip?: string | null
          minimum_investment?: number | null
          name: string
          property_type?: string | null
          short_description?: string | null
          slug: string
          sponsor_id?: string | null
          sponsor_name?: string | null
          status?: string | null
          target_return?: string | null
          total_equity?: number | null
          updated_at?: string
        }
        Update: {
          accredited_only?: boolean | null
          approved?: boolean | null
          closing_date?: string | null
          created_at?: string
          description?: string | null
          distribution_frequency?: string | null
          equity_remaining?: number | null
          hero_image_url?: string | null
          hold_period?: string | null
          id?: string
          investment_type?: string | null
          investment_url?: string | null
          location_city?: string | null
          location_country?: string | null
          location_state?: string | null
          location_street?: string | null
          location_zip?: string | null
          minimum_investment?: number | null
          name?: string
          property_type?: string | null
          short_description?: string | null
          slug?: string
          sponsor_id?: string | null
          sponsor_name?: string | null
          status?: string | null
          target_return?: string | null
          total_equity?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "investments_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          is_accredited_investor: boolean | null
          last_name: string | null
          phone_number: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          is_accredited_investor?: boolean | null
          last_name?: string | null
          phone_number?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          is_accredited_investor?: boolean | null
          last_name?: string | null
          phone_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      saved_investments: {
        Row: {
          created_at: string
          id: string
          investment_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          investment_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          investment_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_investments_investment_id_fkey"
            columns: ["investment_id"]
            isOneToOne: false
            referencedRelation: "investments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_investments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_footer_links: {
        Row: {
          category: string
          created_at: string
          filters: Json | null
          id: string
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          category: string
          created_at?: string
          filters?: Json | null
          id?: string
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          category?: string
          created_at?: string
          filters?: Json | null
          id?: string
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      sponsor_introductions: {
        Row: {
          created_at: string
          id: string
          sponsor_id: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          sponsor_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          sponsor_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_introductions_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sponsor_introductions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsors: {
        Row: {
          advertised_returns: string | null
          approved: boolean | null
          assets_under_management: string | null
          contact_email: string | null
          created_at: string
          deal_volume: string | null
          description: string | null
          headquarters: string | null
          hero_image_url: string | null
          holding_period: string | null
          id: string
          investment_philosophy: string | null
          investment_strategy: string | null
          investment_types: string[] | null
          linkedin_url: string | null
          logo_url: string | null
          market_focus: string | null
          minimum_investment: string | null
          name: string
          notable_deals: string | null
          number_of_deals: number | null
          past_deals: Json | null
          property_types: string[] | null
          short_description: string | null
          slug: string
          team_highlights: string | null
          team_members: Json | null
          track_record: string | null
          updated_at: string
          website_url: string | null
          year_founded: number | null
        }
        Insert: {
          advertised_returns?: string | null
          approved?: boolean | null
          assets_under_management?: string | null
          contact_email?: string | null
          created_at?: string
          deal_volume?: string | null
          description?: string | null
          headquarters?: string | null
          hero_image_url?: string | null
          holding_period?: string | null
          id?: string
          investment_philosophy?: string | null
          investment_strategy?: string | null
          investment_types?: string[] | null
          linkedin_url?: string | null
          logo_url?: string | null
          market_focus?: string | null
          minimum_investment?: string | null
          name: string
          notable_deals?: string | null
          number_of_deals?: number | null
          past_deals?: Json | null
          property_types?: string[] | null
          short_description?: string | null
          slug: string
          team_highlights?: string | null
          team_members?: Json | null
          track_record?: string | null
          updated_at?: string
          website_url?: string | null
          year_founded?: number | null
        }
        Update: {
          advertised_returns?: string | null
          approved?: boolean | null
          assets_under_management?: string | null
          contact_email?: string | null
          created_at?: string
          deal_volume?: string | null
          description?: string | null
          headquarters?: string | null
          hero_image_url?: string | null
          holding_period?: string | null
          id?: string
          investment_philosophy?: string | null
          investment_strategy?: string | null
          investment_types?: string[] | null
          linkedin_url?: string | null
          logo_url?: string | null
          market_focus?: string | null
          minimum_investment?: string | null
          name?: string
          notable_deals?: string | null
          number_of_deals?: number | null
          past_deals?: Json | null
          property_types?: string[] | null
          short_description?: string | null
          slug?: string
          team_highlights?: string | null
          team_members?: Json | null
          track_record?: string | null
          updated_at?: string
          website_url?: string | null
          year_founded?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
