export function generateTempPassword(length: number = 12): string {
  // Define the character sets for the password
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz"
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const numberChars = "0123456789"
  const specialChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?"

  // Combine all characters for random selection
  const allChars = lowercaseChars + uppercaseChars + numberChars + specialChars

  // Ensure password contains at least one character from each set
  const randomChar = (chars: string) => chars[Math.floor(Math.random() * chars.length)]
  const passwordArray = [
    randomChar(lowercaseChars),
    randomChar(uppercaseChars),
    randomChar(numberChars),
    randomChar(specialChars),
  ]

  // Fill the rest of the password length with random characters from all available characters
  for (let i = 4; i < length; i++) {
    passwordArray.push(randomChar(allChars))
  }

  // Shuffle the array to ensure random distribution of characters
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]]
  }

  // Join array into a string to form the final password
  return passwordArray.join("")
}
