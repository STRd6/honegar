require("math").pollute()
require("extensions")

{defaults, extend} = require "util"

extend global,
  defaults: defaults
  extend: extend

styleNode = document.createElement("style")
styleNode.innerHTML = require "./style"

document.head.appendChild(styleNode)
