const example =
  "'Hello World' - said John. 'FIFA' - isn't a football game. 'Super'."

console.log(example.replace(/(^|[^a-zA-Z0-9_])'|'($|[^a-zA-Z0-9_])/g, '$1"$2'))
