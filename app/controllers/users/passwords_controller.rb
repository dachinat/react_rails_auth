# frozen_string_literal: true

class Users::PasswordsController < Devise::PasswordsController
  clear_respond_to
  respond_to :json

  def check_token
    render json: { valid: !!User.find_by(
      reset_password_token: Devise.token_generator.digest(self, :reset_password_token, params[:reset_password_token])
    ) }
  end

  # GET /resource/password/new
  # def new
  #   super
  # end

  # POST /resource/password
  # def create
  #   super
  # end

  # GET /resource/password/edit?reset_password_token=abcdef
  # def edit
  #   super
  # end

  # PUT /resource/password
  # def update
  #   super
  # end

  # protected

  # def after_resetting_password_path_for(resource)
  #   super(resource)
  # end

  # The path used after sending reset password instructions
  # def after_sending_reset_password_instructions_path_for(resource_name)
  #   super(resource_name)
  # end
end
