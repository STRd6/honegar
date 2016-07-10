NameGenerator = require "/culture/name_generator"

describe "Culture Name Generator", ->
  it "should generate random names", ->
    generator = NameGenerator()

    [0..10].forEach ->
      console.log generator.generate()
