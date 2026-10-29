export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      fal_test_runs: {
        Row: {
          duration: number
          error: string | null
          finished_at: string | null
          id: string
          request_id: string | null
          started_at: string
          status: string
          user_id: string
          video_url: string | null
        }
        Insert: {
          duration: number
          error?: string | null
          finished_at?: string | null
          id?: string
          request_id?: string | null
          started_at?: string
          status?: string
          user_id: string
          video_url?: string | null
        }
        Update: {
          duration?: number
          error?: string | null
          finished_at?: string | null
          id?: string
          request_id?: string | null
          started_at?: string
          status?: string
          user_id?: string
          video_url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      video_launch_settings: {
        Row: {
          daily_limit: number
          id: boolean
          phone: string
          qr_url: string | null
          recipient: string
        }
        Insert: {
          daily_limit?: number
          id?: boolean
          phone?: string
          qr_url?: string | null
          recipient?: string
        }
        Update: {
          daily_limit?: number
          id?: boolean
          phone?: string
          qr_url?: string | null
          recipient?: string
        }
        Relationships: []
      }
      video_payments: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          cost_usd: number
          created_at: string
          currency: string
          duration: number
          email: string
          error: string | null
          finished_at: string | null
          id: string
          music: string
          provider: string
          provider_session: string | null
          receipt: string | null
          request_id: string | null
          started_at: string | null
          status: string
          template: string
          user_id: string
          video_url: string | null
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          cost_usd?: number
          created_at?: string
          currency?: string
          duration: number
          email: string
          error?: string | null
          finished_at?: string | null
          id?: string
          music: string
          provider?: string
          provider_session?: string | null
          receipt?: string | null
          request_id?: string | null
          started_at?: string | null
          status?: string
          template: string
          user_id: string
          video_url?: string | null
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          cost_usd?: number
          created_at?: string
          currency?: string
          duration?: number
          email?: string
          error?: string | null
          finished_at?: string | null
          id?: string
          music?: string
          provider?: string
          provider_session?: string | null
          receipt?: string | null
          request_id?: string | null
          started_at?: string | null
          status?: string
          template?: string
          user_id?: string
          video_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_video_payment: {
        Args: { p_id: string }
        Returns: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          cost_usd: number
          created_at: string
          currency: string
          duration: number
          email: string
          error: string | null
          finished_at: string | null
          id: string
          music: string
          provider: string
          provider_session: string | null
          receipt: string | null
          request_id: string | null
          started_at: string | null
          status: string
          template: string
          user_id: string
          video_url: string | null
        }
        SetofOptions: {
          from: "*"
          to: "video_payments"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_video_payment: {
        Args: {
          p_duration: number
          p_music: string
          p_provider: string
          p_receipt?: string
          p_template: string
        }
        Returns: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          cost_usd: number
          created_at: string
          currency: string
          duration: number
          email: string
          error: string | null
          finished_at: string | null
          id: string
          music: string
          provider: string
          provider_session: string | null
          receipt: string | null
          request_id: string | null
          started_at: string | null
          status: string
          template: string
          user_id: string
          video_url: string | null
        }
        SetofOptions: {
          from: "*"
          to: "video_payments"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      review_video_payment: {
        Args: { p_approve: boolean; p_id: string }
        Returns: undefined
      }
      save_video_job: {
        Args: {
          p_error?: string
          p_id: string
          p_request: string
          p_status: string
          p_video?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
