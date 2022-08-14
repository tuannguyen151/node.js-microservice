export default async ({ user }) => {
  const { first_name: firstName, last_name: lastName, phone, email } = user

  return { firstName, lastName, phone, email }
}
