terraform {
	required_providers {
		auth0 = {
			source = "auth0/auth0"
			version = ">= 1.0.0"
		}
	}
}

provider "auth0" {}

module "login_screen_partial" {
	source = "./modules/auth0_prompt_partials"
	
	prompt_type = "login"
	screen_name = "login"
	form_content_start = file("${path.module}/partials/form-content-start.html")
	form_content_end = file("${path.module}/partials/form-content-end.html")
	form_footer_start = file("${path.module}/partials/form-footer-start.html")
	form_footer_end = file("${path.module}/partials/form-footer-end.html")
}
