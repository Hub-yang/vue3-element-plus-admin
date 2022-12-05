export function validate_email(value) {
  const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
  return regEmail.test(value)
}

export function validate_password(value) {
  const regPassword = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/
  return regPassword.test(value)
}

export function validate_code(value) {
  const regCode = /^[a-z0-9]{6}$/
  return regCode.test(value)
}
