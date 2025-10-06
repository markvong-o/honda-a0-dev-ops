# variables.tf in modules/auth0_prompt_partials
variable "prompt_type" {
  type        = string
  description = "The type of Auth0 prompt (e.g., login, signup, customized-consent)."
}

variable "screen_name" {
  type        = string
  description = "The name of the screen associated with the partials (e.g., login, signup)."
}

variable "form_content_start" {
  type        = string
  description = "HTML content to insert at the start of the form."
  default     = ""
}

variable "form_content_end" {
  type        = string
  description = "HTML content to insert at the end of the form."
  default     = ""
}

variable "form_footer_start" {
  type = string
  description = "HTML content to insert at start of footer."
  default = "<></>"
}

variable "form_footer_end" {
  type = string
  description = "HTML content to insert at end of footer."
  default = "<></>"
}
