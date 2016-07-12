require("math").pollute()

{defaults, extend} = require "util"

global.defaults = defaults

styleNode = document.createElement("style")
styleNode.innerHTML = require "./style"

document.head.appendChild(styleNode)
