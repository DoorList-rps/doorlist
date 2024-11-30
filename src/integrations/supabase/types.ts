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
      Investments: {
        Row: {
          "% Remaining": string | null
          "1031 Exchange?": string | null
          "Accredited Investor": string | null
          "Approved?": string | null
          "Cap Rate": string | null
          "Closing Date": string | null
          Description: string | null
          "Distribution Frequency": string | null
          Documents: string | null
          Email: string | null
          "Equity Remaining": string | null
          "Equity/Debt": string | null
          "Hero Image": string | null
          "Hero Image Formula": string | null
          "Hold Period - Details": string | null
          "Hold Period - Display": string | null
          "Image Link": string | null
          Images: string | null
          "Interested Users": string | null
          "Investment ID": string
          "Investment Name": string | null
          "Investment Type": string | null
          "Investment Type - Display": string | null
          "Investment URL": string | null
          "Last Modified": string | null
          Liquidity: string | null
          "Location - City": string | null
          "Location - City, State": string | null
          "Location - Country": string | null
          "Location - Display": string | null
          "Location - State": string | null
          "Location - Street Address": string | null
          "Location - Zip Code": number | null
          "Min Investment - Num": string | null
          "Min Investment - Text": string | null
          "Monthly Rent": string | null
          "Name (from Sponsor)": string | null
          Notes: string | null
          "Page Views": string | null
          "Passive Income - Num": string | null
          "Passive Income - Text": string | null
          Primary_Key: string
          "Property Type": string | null
          "Property Type - Display": string | null
          "Purchase Price": string | null
          "SEO:Description": string | null
          "SEO:Index": string | null
          "SEO:Slug": string | null
          "SEO:Title": string | null
          "Short Description": string | null
          "Smart Tags": string | null
          Sponsor: string | null
          "State (from Location - State)": string | null
          Status: string | null
          Thumbnail: string | null
          "Total Equity": string | null
          "Total Return - Estimated": string | null
          "Unique Identified from Source": string | null
          Video: string | null
          "Year Built": string | null
        }
        Insert: {
          "% Remaining"?: string | null
          "1031 Exchange?"?: string | null
          "Accredited Investor"?: string | null
          "Approved?"?: string | null
          "Cap Rate"?: string | null
          "Closing Date"?: string | null
          Description?: string | null
          "Distribution Frequency"?: string | null
          Documents?: string | null
          Email?: string | null
          "Equity Remaining"?: string | null
          "Equity/Debt"?: string | null
          "Hero Image"?: string | null
          "Hero Image Formula"?: string | null
          "Hold Period - Details"?: string | null
          "Hold Period - Display"?: string | null
          "Image Link"?: string | null
          Images?: string | null
          "Interested Users"?: string | null
          "Investment ID": string
          "Investment Name"?: string | null
          "Investment Type"?: string | null
          "Investment Type - Display"?: string | null
          "Investment URL"?: string | null
          "Last Modified"?: string | null
          Liquidity?: string | null
          "Location - City"?: string | null
          "Location - City, State"?: string | null
          "Location - Country"?: string | null
          "Location - Display"?: string | null
          "Location - State"?: string | null
          "Location - Street Address"?: string | null
          "Location - Zip Code"?: number | null
          "Min Investment - Num"?: string | null
          "Min Investment - Text"?: string | null
          "Monthly Rent"?: string | null
          "Name (from Sponsor)"?: string | null
          Notes?: string | null
          "Page Views"?: string | null
          "Passive Income - Num"?: string | null
          "Passive Income - Text"?: string | null
          Primary_Key?: string
          "Property Type"?: string | null
          "Property Type - Display"?: string | null
          "Purchase Price"?: string | null
          "SEO:Description"?: string | null
          "SEO:Index"?: string | null
          "SEO:Slug"?: string | null
          "SEO:Title"?: string | null
          "Short Description"?: string | null
          "Smart Tags"?: string | null
          Sponsor?: string | null
          "State (from Location - State)"?: string | null
          Status?: string | null
          Thumbnail?: string | null
          "Total Equity"?: string | null
          "Total Return - Estimated"?: string | null
          "Unique Identified from Source"?: string | null
          Video?: string | null
          "Year Built"?: string | null
        }
        Update: {
          "% Remaining"?: string | null
          "1031 Exchange?"?: string | null
          "Accredited Investor"?: string | null
          "Approved?"?: string | null
          "Cap Rate"?: string | null
          "Closing Date"?: string | null
          Description?: string | null
          "Distribution Frequency"?: string | null
          Documents?: string | null
          Email?: string | null
          "Equity Remaining"?: string | null
          "Equity/Debt"?: string | null
          "Hero Image"?: string | null
          "Hero Image Formula"?: string | null
          "Hold Period - Details"?: string | null
          "Hold Period - Display"?: string | null
          "Image Link"?: string | null
          Images?: string | null
          "Interested Users"?: string | null
          "Investment ID"?: string
          "Investment Name"?: string | null
          "Investment Type"?: string | null
          "Investment Type - Display"?: string | null
          "Investment URL"?: string | null
          "Last Modified"?: string | null
          Liquidity?: string | null
          "Location - City"?: string | null
          "Location - City, State"?: string | null
          "Location - Country"?: string | null
          "Location - Display"?: string | null
          "Location - State"?: string | null
          "Location - Street Address"?: string | null
          "Location - Zip Code"?: number | null
          "Min Investment - Num"?: string | null
          "Min Investment - Text"?: string | null
          "Monthly Rent"?: string | null
          "Name (from Sponsor)"?: string | null
          Notes?: string | null
          "Page Views"?: string | null
          "Passive Income - Num"?: string | null
          "Passive Income - Text"?: string | null
          Primary_Key?: string
          "Property Type"?: string | null
          "Property Type - Display"?: string | null
          "Purchase Price"?: string | null
          "SEO:Description"?: string | null
          "SEO:Index"?: string | null
          "SEO:Slug"?: string | null
          "SEO:Title"?: string | null
          "Short Description"?: string | null
          "Smart Tags"?: string | null
          Sponsor?: string | null
          "State (from Location - State)"?: string | null
          Status?: string | null
          Thumbnail?: string | null
          "Total Equity"?: string | null
          "Total Return - Estimated"?: string | null
          "Unique Identified from Source"?: string | null
          Video?: string | null
          "Year Built"?: string | null
        }
        Relationships: []
      }
      Sponsors: {
        Row: {
          "(Do not update) Manager Type": string | null
          "Advertised Returns": string | null
          "Approved?": string | null
          "Assets Under Management": string | null
          "Contact Email": string | null
          Created: string | null
          "Deal Photos": string | null
          "Deal Volume to Date": string | null
          "Deals for Site?": string | null
          Description: string | null
          Headquarters: string | null
          "Hero Image": string | null
          "Hero Image Formula": string | null
          "Holding Period": string | null
          "Information required from Sponsor to be in Prod": string | null
          "Investment Type": string | null
          "Investment Type (individual/fund)": string | null
          Investments: string | null
          "Investor Type": string | null
          "Last Modified": string | null
          "LinkedIn URL": string | null
          Logo: string | null
          "Manager URL": string | null
          "Minimum Investment": string | null
          Name: string | null
          Notes: string | null
          "Number of Deals": string | null
          Primary_Key: string
          "Property Type": string | null
          "SEO:Description": string | null
          "SEO:Index": string | null
          "SEO:Slug": string | null
          "SEO:Title": string | null
          "Short Description": string | null
          "Smart Tags": string | null
          "Year Founded": number | null
        }
        Insert: {
          "(Do not update) Manager Type"?: string | null
          "Advertised Returns"?: string | null
          "Approved?"?: string | null
          "Assets Under Management"?: string | null
          "Contact Email"?: string | null
          Created?: string | null
          "Deal Photos"?: string | null
          "Deal Volume to Date"?: string | null
          "Deals for Site?"?: string | null
          Description?: string | null
          Headquarters?: string | null
          "Hero Image"?: string | null
          "Hero Image Formula"?: string | null
          "Holding Period"?: string | null
          "Information required from Sponsor to be in Prod"?: string | null
          "Investment Type"?: string | null
          "Investment Type (individual/fund)"?: string | null
          Investments?: string | null
          "Investor Type"?: string | null
          "Last Modified"?: string | null
          "LinkedIn URL"?: string | null
          Logo?: string | null
          "Manager URL"?: string | null
          "Minimum Investment"?: string | null
          Name?: string | null
          Notes?: string | null
          "Number of Deals"?: string | null
          Primary_Key?: string
          "Property Type"?: string | null
          "SEO:Description"?: string | null
          "SEO:Index"?: string | null
          "SEO:Slug"?: string | null
          "SEO:Title"?: string | null
          "Short Description"?: string | null
          "Smart Tags"?: string | null
          "Year Founded"?: number | null
        }
        Update: {
          "(Do not update) Manager Type"?: string | null
          "Advertised Returns"?: string | null
          "Approved?"?: string | null
          "Assets Under Management"?: string | null
          "Contact Email"?: string | null
          Created?: string | null
          "Deal Photos"?: string | null
          "Deal Volume to Date"?: string | null
          "Deals for Site?"?: string | null
          Description?: string | null
          Headquarters?: string | null
          "Hero Image"?: string | null
          "Hero Image Formula"?: string | null
          "Holding Period"?: string | null
          "Information required from Sponsor to be in Prod"?: string | null
          "Investment Type"?: string | null
          "Investment Type (individual/fund)"?: string | null
          Investments?: string | null
          "Investor Type"?: string | null
          "Last Modified"?: string | null
          "LinkedIn URL"?: string | null
          Logo?: string | null
          "Manager URL"?: string | null
          "Minimum Investment"?: string | null
          Name?: string | null
          Notes?: string | null
          "Number of Deals"?: string | null
          Primary_Key?: string
          "Property Type"?: string | null
          "SEO:Description"?: string | null
          "SEO:Index"?: string | null
          "SEO:Slug"?: string | null
          "SEO:Title"?: string | null
          "Short Description"?: string | null
          "Smart Tags"?: string | null
          "Year Founded"?: number | null
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