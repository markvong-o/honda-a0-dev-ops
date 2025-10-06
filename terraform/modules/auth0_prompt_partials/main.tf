# main.tf in modules/auth0_prompt_partials
terraform {
	required_providers {
		auth0 = {
			source = "auth0/auth0"
			version = ">= 1.0.0"
		}
	}
}

resource "auth0_prompt_screen_partial" "my_login_partial" {
  prompt_type = var.prompt_type
  screen_name = var.screen_name

  insertion_points {
    form_content_start = var.form_content_start
    form_content_end   = var.form_content_end
    form_footer_start = var.form_footer_start
    form_footer_end = var.form_footer_end
  }
}
