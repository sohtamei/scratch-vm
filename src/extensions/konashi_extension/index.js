function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Copyright (c) 2020 Yusaku Nishiwaki
 * Released under the Apache-2.0 license
 * LICENSE: http://www.apache.org/licenses/LICENSE-2.0
 */
var ArgumentType = require("../../extension-support/argument-type");

var BlockType = require("../../extension-support/block-type");

var log = require("../../util/log");

var formatMessage = require("format-message");

var KokoroPro = require("./kokoro-pro");

var blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48ZGVmcz48c3R5bGU+LmNscy0xLC5jbHMtOHtmaWxsOiM4OTg5ODk7fS5jbHMtMSwuY2xzLTIsLmNscy0zLC5jbHMtNCwuY2xzLTUsLmNscy02LC5jbHMtNywuY2xzLTgsLmNscy05e3N0cm9rZTojMDAwO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDt9LmNscy0xe3N0cm9rZS13aWR0aDowLjI5OHB4O30uY2xzLTJ7ZmlsbDojYjViNWI2O30uY2xzLTIsLmNscy0ze3N0cm9rZS13aWR0aDowLjEzNHB4O30uY2xzLTEwLC5jbHMtM3tmaWxsOm5vbmU7fS5jbHMtNHtmaWxsOiM1OTU3NTc7fS5jbHMtNCwuY2xzLTUsLmNscy02LC5jbHMtNywuY2xzLTgsLmNscy05e3N0cm9rZS13aWR0aDowLjExMnB4O30uY2xzLTV7ZmlsbDojZjdmOGY4O30uY2xzLTZ7ZmlsbDojYzljYWNhO30uY2xzLTd7ZmlsbDojZmZmYWM0O30uY2xzLTl7ZmlsbDojZmZmO308L3N0eWxlPjwvZGVmcz48dGl0bGU+U2NyYXRjaDwvdGl0bGU+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNy42LjU1NlYzOS40NDRIMzIuNFYuNTU2Wk05LjA4NiwzOC43YS43NDUuNzQ1LDAsMSwxLC43NDQtLjc0NEEuNzQ1Ljc0NSwwLDAsMSw5LjA4NiwzOC43Wm0wLTM1LjkwOWEuNzQ1Ljc0NSwwLDEsMSwuNzQ0LS43NDRBLjc0NS43NDUsMCwwLDEsOS4wODYsMi43OVpNMzAuOTEzLDM4LjdhLjc0NS43NDUsMCwxLDEsLjc0Ni0uNzQ0QS43NDUuNzQ1LDAsMCwxLDMwLjkxMywzOC43Wm0wLTM1LjkwOWEuNzQ1Ljc0NSwwLDEsMSwuNzQ2LS43NDRBLjc0NS43NDUsMCwwLDEsMzAuOTEzLDIuNzlaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMjMuODM1LDkuNjU4bC0uMDA4LS4wMTFhLjEuMSwwLDAsMS0uMDE1LS4wMTguMi4yLDAsMCwwLS4wMTktLjAyNGwtLjA1LS4wNjYtLjA1NS0uMDcxTDIwLjMsNS4xMTZsLS4wMzktLjA1Yy0uMDExLS4wMTYtLjAyNC0uMDMxLS4wMzUtLjA0NGEuMjIyLjIyMiwwLDAsMS0uMDIzLS4wMzIuMTA4LjEwOCwwLDAsMS0uMDE2LS4wMThsMC0uMDA2SDExLjMyQTIuMjM2LDIuMjM2LDAsMCwwLDkuMDg2LDcuMlY4LjYzM2wwLDAsLjAxMy4wMDhhLjAyNC4wMjQsMCwwLDAsLjAxNi4wMTMuMTMzLjEzMywwLDAsMCwuMDIxLjAxOWMuMDEzLjAxMy4wMjkuMDI2LjA0NC4wMzlzLjAzNS4wMzIuMDUzLjA0N2E1LjQzOSw1LjQzOSwwLDAsMSwuMzk0LjQsNS4yMTUsNS4yMTUsMCwwLDEtLjM5NCw3LjM2NGwtLjA1My4wNDRhLjUuNSwwLDAsMS0uMDQ0LjA0Yy0uMDA4LjAwOC0uMDE2LjAxMy0uMDIxLjAxOGEuMDkyLjA5MiwwLDAsMC0uMDE2LjAxM2wtLjAxMy4wMTEsMCwwdjEuNDI5YTIuMjM0LDIuMjM0LDAsMCwwLDIuMjM0LDIuMjM0aDguODY3bC4wMDYtLjAwOGEuMy4zLDAsMCwxLC4wMjEtLjAyM2MuMDEtLjAxNi4wMjYtLjAzNS4wMzktLjA1NnMuMDMyLS4wMzkuMDUtLjA2bDMuMzg1LTQuMzU1Yy4wMTgtLjAyNC4wMzctLjA0Ny4wNTUtLjA2OHMuMDM0LS4wNDUuMDUtLjA2NmEuMjE0LjIxNCwwLDAsMCwuMDE5LS4wMjZsLjAxNS0uMDE2YS4wNjMuMDYzLDAsMCwxLC4wMTEtLjAxM1Y5LjY2Wm0tNi4wNTUsOS41YTIuMzQ0LDIuMzQ0LDAsMCwxLTIuMDYzLTEuMjI3SDE3Ljc4YTEuMTE5LDEuMTE5LDAsMCwwLDAtMi4yMzdIMTUuNzE3YTIuMzQ3LDIuMzQ3LDAsMSwxLDIuMDYzLDMuNDY0Wm0wLTguMzQ0YTIuMzQ0LDIuMzQ0LDAsMCwxLTIuMDYzLTEuMjI3SDE3Ljc4YTEuMTE5LDEuMTE5LDAsMCwwLDAtMi4yMzdIMTUuNzE3YTIuMzQ3LDIuMzQ3LDAsMSwxLDIuMDYzLDMuNDY0WiIvPjxwYXRoIGNsYXNzPSJjbHMtMyIgZD0iTTE4LjksOC40NjdBMS4xMTgsMS4xMTgsMCwwLDAsMTcuNzgsNy4zNUgxNS43MTdhMi4zNDYsMi4zNDYsMCwxLDEsMCwyLjIzN0gxNy43OEExLjExOCwxLjExOCwwLDAsMCwxOC45LDguNDY3WiIvPjxwYXRoIGNsYXNzPSJjbHMtMyIgZD0iTTIwLjEyNywxNi44MTFhMi4zNDcsMi4zNDcsMCwwLDEtNC40MSwxLjEySDE3Ljc4YTEuMTE5LDEuMTE5LDAsMCwwLDAtMi4yMzdIMTUuNzE3YTIuMzQ3LDIuMzQ3LDAsMCwxLDQuNDEsMS4xMTdaIi8+PHBhdGggY2xhc3M9ImNscy0zIiBkPSJNMjAuMTI3LDguNDY3YTIuMzQ3LDIuMzQ3LDAsMCwxLTQuNDEsMS4xMkgxNy43OGExLjExOSwxLjExOSwwLDAsMCwwLTIuMjM3SDE1LjcxN2EyLjM0NiwyLjM0NiwwLDAsMSw0LjQxLDEuMTE3WiIvPjxsaW5lIGNsYXNzPSJjbHMtMyIgeDE9IjE1LjcxNyIgeTE9IjcuMzUiIHgyPSIxMi45NiIgeTI9IjcuMzUiLz48bGluZSBjbGFzcz0iY2xzLTMiIHgxPSIxNS43MTciIHkxPSI5LjU4NyIgeDI9IjEyLjk2IiB5Mj0iOS41ODciLz48cGF0aCBjbGFzcz0iY2xzLTMiIGQ9Ik0yMC4xMjcsMTYuODExYTIuMzQ3LDIuMzQ3LDAsMCwxLTQuNDEsMS4xMkgxNy43OGExLjExOSwxLjExOSwwLDAsMCwwLTIuMjM3SDE1LjcxN2EyLjM0NywyLjM0NywwLDAsMSw0LjQxLDEuMTE3WiIvPjxsaW5lIGNsYXNzPSJjbHMtMyIgeDE9IjE1LjcxNyIgeTE9IjE1LjY5MyIgeDI9IjEyLjk2IiB5Mj0iMTUuNjkzIi8+PGxpbmUgY2xhc3M9ImNscy0zIiB4MT0iMTUuNzE3IiB5MT0iMTcuOTMiIHgyPSIxMi45NiIgeTI9IjE3LjkzIi8+PGcgaWQ9IkxJTkUiPjxyZWN0IGNsYXNzPSJjbHMtNCIgeD0iMTAuNTgxIiB5PSIxLjMwMSIgd2lkdGg9IjE4LjkyIiBoZWlnaHQ9IjEuODkiLz48L2c+PGcgaWQ9IkxJTkUtMiIgZGF0YS1uYW1lPSJMSU5FIj48cmVjdCBjbGFzcz0iY2xzLTQiIHg9IjEwLjU4MSIgeT0iMzcuMTgxIiB3aWR0aD0iMTguOTIiIGhlaWdodD0iMS44OSIvPjwvZz48cG9seWdvbiBjbGFzcz0iY2xzLTUiIHBvaW50cz0iMTEuNDE3IDMzLjQgMTEuNDE3IDMyLjc4NCAxMi43NTggMzIuNzg0IDEyLjc1OCAzMi4wMzkgMTEuNDE3IDMyLjAzOSA3LjA3NiAzMi4wMzkgNy4wNzYgMzMuOTgxIDcuMDc2IDM0LjQ5MSA3LjA3NiAzNi40MzMgMTEuNDE3IDM2LjQzMyAxMi43NTggMzYuNDMzIDEyLjc1OCAzNS42ODggMTEuNDE3IDM1LjY4OCAxMS40MTcgMzUuMDc0IDExLjQxNyAzMy40Ii8+PHBhdGggY2xhc3M9ImNscy02IiBkPSJNMTAuNTgxLDI3LjI3MXYuNzRoLS4wMXYuM0gxMC4yYS4xNTQuMTU0LDAsMCwwLS4xNS4xNXYxYS4xNTQuMTU0LDAsMCwwLC4xNS4xNWguMDhWMjguNWguMjl2Mi4wNUg3LjIyMWwtLjM3LjM3LS4xMS0uMTEuNDgtLjQ5VjI5LjhoLS40M3YtNC4zMmguNDN2LS41MmwtLjQ4LS40OC4xMS0uMTEuMzcuMzdoMy4zNXYyLjA1aC0uMjl2LTEuMTJIMTAuMmEuMTU0LjE1NCwwLDAsMC0uMTUuMTV2MS4wMWEuMTU0LjE1NCwwLDAsMCwuMTUuMTVoLjM3di4yOVoiLz48cmVjdCBjbGFzcz0iY2xzLTQiIHg9IjI1Ljc0MyIgeT0iNy44MTEiIHdpZHRoPSIwLjU5NiIgaGVpZ2h0PSIxLjE5MiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzQuNDQ4IC0xNy42MzQpIHJvdGF0ZSg5MCkiLz48cmVjdCBjbGFzcz0iY2xzLTQiIHg9IjI1Ljc0MyIgeT0iMTYuNzgzIiB3aWR0aD0iMC41OTYiIGhlaWdodD0iMS4xOTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQzLjQyIC04LjY2Mikgcm90YXRlKDkwKSIvPjxyZWN0IGNsYXNzPSJjbHMtNCIgeD0iMTAuNjYzIiB5PSIyMi43MzciIHdpZHRoPSIwLjU5NiIgaGVpZ2h0PSIxLjE5MiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzQuMjk0IDEyLjM3MSkgcm90YXRlKDkwKSIvPjxyZWN0IGNsYXNzPSJjbHMtNCIgeD0iMTIuMDc3IiB5PSIyNC42MTEiIHdpZHRoPSIwLjU5NiIgaGVpZ2h0PSIxLjE5MiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjQuNzUxIDUwLjQxMykgcm90YXRlKDE4MCkiLz48cmVjdCBjbGFzcz0iY2xzLTQiIHg9IjIzLjY5OSIgeT0iMTguNzg4IiB3aWR0aD0iMS4yMDQiIGhlaWdodD0iMS45NDgiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ0LjA2MyAtNC41MzkpIHJvdGF0ZSg5MCkiLz48cmVjdCBjbGFzcz0iY2xzLTQiIHg9IjIzLjY5OSIgeT0iMjAuMjg4IiB3aWR0aD0iMS4yMDQiIGhlaWdodD0iMS45NDgiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ1LjU2MyAtMy4wMzkpIHJvdGF0ZSg5MCkiLz48cmVjdCBjbGFzcz0iY2xzLTQiIHg9IjI1Ljc0MyIgeT0iMTMuNzkyIiB3aWR0aD0iMC41OTYiIGhlaWdodD0iMS4xOTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQwLjQyOSAtMTEuNjUzKSByb3RhdGUoOTApIi8+PHJlY3QgY2xhc3M9ImNscy00IiB4PSIyNS43NDMiIHk9IjEwLjgwMSIgd2lkdGg9IjAuNTk2IiBoZWlnaHQ9IjEuMTkyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzNy40MzggLTE0LjY0NCkgcm90YXRlKDkwKSIvPjxnIGlkPSJBUkMiPjxyZWN0IGNsYXNzPSJjbHMtNyIgeD0iMjguNjcxIiB5PSI3Ljg0OSIgd2lkdGg9IjEuNDkiIGhlaWdodD0iMS4xMTciLz48L2c+PGcgaWQ9IkFSQy0yIiBkYXRhLW5hbWU9IkFSQyI+PHJlY3QgY2xhc3M9ImNscy03IiB4PSIyOC42NzEiIHk9IjEwLjgzOSIgd2lkdGg9IjEuNDkiIGhlaWdodD0iMS4xMTciLz48L2c+PGcgaWQ9IkFSQy0zIiBkYXRhLW5hbWU9IkFSQyI+PHJlY3QgY2xhc3M9ImNscy03IiB4PSIyOC42NzEiIHk9IjEzLjgzIiB3aWR0aD0iMS40OSIgaGVpZ2h0PSIxLjExNyIvPjwvZz48ZyBpZD0iQVJDLTQiIGRhdGEtbmFtZT0iQVJDIj48cmVjdCBjbGFzcz0iY2xzLTciIHg9IjI4LjY3MSIgeT0iMTYuODIiIHdpZHRoPSIxLjQ5IiBoZWlnaHQ9IjEuMTE3Ii8+PC9nPjxnIGlkPSJBUkMtNSIgZGF0YS1uYW1lPSJBUkMiPjxyZWN0IGNsYXNzPSJjbHMtNyIgeD0iOC4yNzYiIHk9IjIxLjMxNyIgd2lkdGg9IjEuMTE3IiBoZWlnaHQ9IjEuNDkiLz48L2c+PHBhdGggY2xhc3M9ImNscy00IiBkPSJNMTYuMSwyNC43ODlWMjMuNTIyYS4xNDguMTQ4LDAsMCwwLS4xNS0uMTQ3SDE0LjM1NGEuMTQ3LjE0NywwLDAsMC0uMTQ5LjE0N3YzLjQyN2EuMTQ4LjE0OCwwLDAsMCwuMTQ5LjE1aDEuNTkzYS4xNDkuMTQ5LDAsMCwwLC4xNS0uMTVWMjUuNjg1aDB2LS45WiIvPjxwYXRoIGNsYXNzPSJjbHMtNCIgZD0iTTE3Ljk4OSwyNC43ODlWMjMuNTIyYS4xNDguMTQ4LDAsMCwwLS4xNS0uMTQ3SDE2LjI0N2EuMTQ3LjE0NywwLDAsMC0uMTUuMTQ3djMuNDI3YS4xNDguMTQ4LDAsMCwwLC4xNS4xNWgxLjU5MmEuMTQ5LjE0OSwwLDAsMCwuMTUtLjE1VjI1LjY4NWgwdi0uOVoiLz48cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Ik0xOS44ODEsMjQuNzg5VjIzLjUyMmEuMTQ3LjE0NywwLDAsMC0uMTQ5LS4xNDdIMTguMTM5YS4xNDguMTQ4LDAsMCwwLS4xNS4xNDd2My40MjdhLjE0OS4xNDksMCwwLDAsLjE1LjE1aDEuNTkzYS4xNDguMTQ4LDAsMCwwLC4xNDktLjE1VjI1LjY4NWgwdi0uOVoiLz48cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Ik0yMS43NzQsMjQuNzg5VjIzLjUyMmEuMTQ4LjE0OCwwLDAsMC0uMTUtLjE0N0gyMC4wMzFhLjE0OC4xNDgsMCwwLDAtLjE1LjE0N3YzLjQyN2EuMTQ5LjE0OSwwLDAsMCwuMTUuMTVoMS41OTNhLjE0OS4xNDksMCwwLDAsLjE1LS4xNVYyNS42ODVoMHYtLjlaIi8+PHBhdGggY2xhc3M9ImNscy00IiBkPSJNMjMuNjY2LDI0Ljc4OVYyMy41MjJhLjE0OC4xNDgsMCwwLDAtLjE1LS4xNDdIMjEuOTIzYS4xNDcuMTQ3LDAsMCwwLS4xNDkuMTQ3djMuNDI3YS4xNDguMTQ4LDAsMCwwLC4xNDkuMTVoMS41OTNhLjE0OS4xNDksMCwwLDAsLjE1LS4xNVYyNS42ODVoMHYtLjlaIi8+PHBhdGggY2xhc3M9ImNscy02IiBkPSJNMzEuMjQxLDIwLjk0MWgtNC4wM2EuMjIyLjIyMiwwLDAsMC0uMjIuMjJ2NC4wM2EuMjIyLjIyMiwwLDAsMCwuMjIuMjJoNC4wM2EuMjIyLjIyMiwwLDAsMCwuMjItLjIydi00LjAzQS4yMjIuMjIyLDAsMCwwLDMxLjI0MSwyMC45NDFabS0yLjAxLDMuNWExLjI2NSwxLjI2NSwwLDEsMSwxLjI2LTEuMjdBMS4yNjUsMS4yNjUsMCwwLDEsMjkuMjMxLDI0LjQ0MVoiLz48cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Ik0zMC40OTEsMjMuMTcxYTEuMjY1LDEuMjY1LDAsMSwxLTEuMjYtMS4yNkExLjI1NywxLjI1NywwLDAsMSwzMC40OTEsMjMuMTcxWiIvPjxyZWN0IGNsYXNzPSJjbHMtOCIgeD0iMTYuMzg4IiB5PSIyNy43NDMiIHdpZHRoPSIxNi4wMTYiIGhlaWdodD0iNy41NTkiLz48cmVjdCBjbGFzcz0iY2xzLTkiIHg9IjI1LjY5OSIgeT0iMjguNTk3IiB3aWR0aD0iMy43MjUiIGhlaWdodD0iOC45NCIgcng9IjAuMzcyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2MC42MjkgNS41MDUpIHJvdGF0ZSg5MCkiLz48cmVjdCBjbGFzcz0iY2xzLTEwIiB4PSI2LjMyNyIgd2lkdGg9IjI3LjM0NyIgaGVpZ2h0PSI0MCIvPjwvc3ZnPg==';
var menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48ZGVmcz48c3R5bGU+LmNscy0xLC5jbHMtOHtmaWxsOiM4OTg5ODk7fS5jbHMtMSwuY2xzLTIsLmNscy0zLC5jbHMtNCwuY2xzLTUsLmNscy02LC5jbHMtNywuY2xzLTgsLmNscy05e3N0cm9rZTojMDAwO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDt9LmNscy0xe3N0cm9rZS13aWR0aDowLjI5OHB4O30uY2xzLTJ7ZmlsbDojYjViNWI2O30uY2xzLTIsLmNscy0ze3N0cm9rZS13aWR0aDowLjEzNHB4O30uY2xzLTEwLC5jbHMtM3tmaWxsOm5vbmU7fS5jbHMtNHtmaWxsOiM1OTU3NTc7fS5jbHMtNCwuY2xzLTUsLmNscy02LC5jbHMtNywuY2xzLTgsLmNscy05e3N0cm9rZS13aWR0aDowLjExMnB4O30uY2xzLTV7ZmlsbDojZjdmOGY4O30uY2xzLTZ7ZmlsbDojYzljYWNhO30uY2xzLTd7ZmlsbDojZmZmYWM0O30uY2xzLTl7ZmlsbDojZmZmO308L3N0eWxlPjwvZGVmcz48dGl0bGU+U2NyYXRjaDwvdGl0bGU+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNy42LjU1NlYzOS40NDRIMzIuNFYuNTU2Wk05LjA4NiwzOC43YS43NDUuNzQ1LDAsMSwxLC43NDQtLjc0NEEuNzQ1Ljc0NSwwLDAsMSw5LjA4NiwzOC43Wm0wLTM1LjkwOWEuNzQ1Ljc0NSwwLDEsMSwuNzQ0LS43NDRBLjc0NS43NDUsMCwwLDEsOS4wODYsMi43OVpNMzAuOTEzLDM4LjdhLjc0NS43NDUsMCwxLDEsLjc0Ni0uNzQ0QS43NDUuNzQ1LDAsMCwxLDMwLjkxMywzOC43Wm0wLTM1LjkwOWEuNzQ1Ljc0NSwwLDEsMSwuNzQ2LS43NDRBLjc0NS43NDUsMCwwLDEsMzAuOTEzLDIuNzlaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMjMuODM1LDkuNjU4bC0uMDA4LS4wMTFhLjEuMSwwLDAsMS0uMDE1LS4wMTguMi4yLDAsMCwwLS4wMTktLjAyNGwtLjA1LS4wNjYtLjA1NS0uMDcxTDIwLjMsNS4xMTZsLS4wMzktLjA1Yy0uMDExLS4wMTYtLjAyNC0uMDMxLS4wMzUtLjA0NGEuMjIyLjIyMiwwLDAsMS0uMDIzLS4wMzIuMTA4LjEwOCwwLDAsMS0uMDE2LS4wMThsMC0uMDA2SDExLjMyQTIuMjM2LDIuMjM2LDAsMCwwLDkuMDg2LDcuMlY4LjYzM2wwLDAsLjAxMy4wMDhhLjAyNC4wMjQsMCwwLDAsLjAxNi4wMTMuMTMzLjEzMywwLDAsMCwuMDIxLjAxOWMuMDEzLjAxMy4wMjkuMDI2LjA0NC4wMzlzLjAzNS4wMzIuMDUzLjA0N2E1LjQzOSw1LjQzOSwwLDAsMSwuMzk0LjQsNS4yMTUsNS4yMTUsMCwwLDEtLjM5NCw3LjM2NGwtLjA1My4wNDRhLjUuNSwwLDAsMS0uMDQ0LjA0Yy0uMDA4LjAwOC0uMDE2LjAxMy0uMDIxLjAxOGEuMDkyLjA5MiwwLDAsMC0uMDE2LjAxM2wtLjAxMy4wMTEsMCwwdjEuNDI5YTIuMjM0LDIuMjM0LDAsMCwwLDIuMjM0LDIuMjM0aDguODY3bC4wMDYtLjAwOGEuMy4zLDAsMCwxLC4wMjEtLjAyM2MuMDEtLjAxNi4wMjYtLjAzNS4wMzktLjA1NnMuMDMyLS4wMzkuMDUtLjA2bDMuMzg1LTQuMzU1Yy4wMTgtLjAyNC4wMzctLjA0Ny4wNTUtLjA2OHMuMDM0LS4wNDUuMDUtLjA2NmEuMjE0LjIxNCwwLDAsMCwuMDE5LS4wMjZsLjAxNS0uMDE2YS4wNjMuMDYzLDAsMCwxLC4wMTEtLjAxM1Y5LjY2Wm0tNi4wNTUsOS41YTIuMzQ0LDIuMzQ0LDAsMCwxLTIuMDYzLTEuMjI3SDE3Ljc4YTEuMTE5LDEuMTE5LDAsMCwwLDAtMi4yMzdIMTUuNzE3YTIuMzQ3LDIuMzQ3LDAsMSwxLDIuMDYzLDMuNDY0Wm0wLTguMzQ0YTIuMzQ0LDIuMzQ0LDAsMCwxLTIuMDYzLTEuMjI3SDE3Ljc4YTEuMTE5LDEuMTE5LDAsMCwwLDAtMi4yMzdIMTUuNzE3YTIuMzQ3LDIuMzQ3LDAsMSwxLDIuMDYzLDMuNDY0WiIvPjxwYXRoIGNsYXNzPSJjbHMtMyIgZD0iTTE4LjksOC40NjdBMS4xMTgsMS4xMTgsMCwwLDAsMTcuNzgsNy4zNUgxNS43MTdhMi4zNDYsMi4zNDYsMCwxLDEsMCwyLjIzN0gxNy43OEExLjExOCwxLjExOCwwLDAsMCwxOC45LDguNDY3WiIvPjxwYXRoIGNsYXNzPSJjbHMtMyIgZD0iTTIwLjEyNywxNi44MTFhMi4zNDcsMi4zNDcsMCwwLDEtNC40MSwxLjEySDE3Ljc4YTEuMTE5LDEuMTE5LDAsMCwwLDAtMi4yMzdIMTUuNzE3YTIuMzQ3LDIuMzQ3LDAsMCwxLDQuNDEsMS4xMTdaIi8+PHBhdGggY2xhc3M9ImNscy0zIiBkPSJNMjAuMTI3LDguNDY3YTIuMzQ3LDIuMzQ3LDAsMCwxLTQuNDEsMS4xMkgxNy43OGExLjExOSwxLjExOSwwLDAsMCwwLTIuMjM3SDE1LjcxN2EyLjM0NiwyLjM0NiwwLDAsMSw0LjQxLDEuMTE3WiIvPjxsaW5lIGNsYXNzPSJjbHMtMyIgeDE9IjE1LjcxNyIgeTE9IjcuMzUiIHgyPSIxMi45NiIgeTI9IjcuMzUiLz48bGluZSBjbGFzcz0iY2xzLTMiIHgxPSIxNS43MTciIHkxPSI5LjU4NyIgeDI9IjEyLjk2IiB5Mj0iOS41ODciLz48cGF0aCBjbGFzcz0iY2xzLTMiIGQ9Ik0yMC4xMjcsMTYuODExYTIuMzQ3LDIuMzQ3LDAsMCwxLTQuNDEsMS4xMkgxNy43OGExLjExOSwxLjExOSwwLDAsMCwwLTIuMjM3SDE1LjcxN2EyLjM0NywyLjM0NywwLDAsMSw0LjQxLDEuMTE3WiIvPjxsaW5lIGNsYXNzPSJjbHMtMyIgeDE9IjE1LjcxNyIgeTE9IjE1LjY5MyIgeDI9IjEyLjk2IiB5Mj0iMTUuNjkzIi8+PGxpbmUgY2xhc3M9ImNscy0zIiB4MT0iMTUuNzE3IiB5MT0iMTcuOTMiIHgyPSIxMi45NiIgeTI9IjE3LjkzIi8+PGcgaWQ9IkxJTkUiPjxyZWN0IGNsYXNzPSJjbHMtNCIgeD0iMTAuNTgxIiB5PSIxLjMwMSIgd2lkdGg9IjE4LjkyIiBoZWlnaHQ9IjEuODkiLz48L2c+PGcgaWQ9IkxJTkUtMiIgZGF0YS1uYW1lPSJMSU5FIj48cmVjdCBjbGFzcz0iY2xzLTQiIHg9IjEwLjU4MSIgeT0iMzcuMTgxIiB3aWR0aD0iMTguOTIiIGhlaWdodD0iMS44OSIvPjwvZz48cG9seWdvbiBjbGFzcz0iY2xzLTUiIHBvaW50cz0iMTEuNDE3IDMzLjQgMTEuNDE3IDMyLjc4NCAxMi43NTggMzIuNzg0IDEyLjc1OCAzMi4wMzkgMTEuNDE3IDMyLjAzOSA3LjA3NiAzMi4wMzkgNy4wNzYgMzMuOTgxIDcuMDc2IDM0LjQ5MSA3LjA3NiAzNi40MzMgMTEuNDE3IDM2LjQzMyAxMi43NTggMzYuNDMzIDEyLjc1OCAzNS42ODggMTEuNDE3IDM1LjY4OCAxMS40MTcgMzUuMDc0IDExLjQxNyAzMy40Ii8+PHBhdGggY2xhc3M9ImNscy02IiBkPSJNMTAuNTgxLDI3LjI3MXYuNzRoLS4wMXYuM0gxMC4yYS4xNTQuMTU0LDAsMCwwLS4xNS4xNXYxYS4xNTQuMTU0LDAsMCwwLC4xNS4xNWguMDhWMjguNWguMjl2Mi4wNUg3LjIyMWwtLjM3LjM3LS4xMS0uMTEuNDgtLjQ5VjI5LjhoLS40M3YtNC4zMmguNDN2LS41MmwtLjQ4LS40OC4xMS0uMTEuMzcuMzdoMy4zNXYyLjA1aC0uMjl2LTEuMTJIMTAuMmEuMTU0LjE1NCwwLDAsMC0uMTUuMTV2MS4wMWEuMTU0LjE1NCwwLDAsMCwuMTUuMTVoLjM3di4yOVoiLz48cmVjdCBjbGFzcz0iY2xzLTQiIHg9IjI1Ljc0MyIgeT0iNy44MTEiIHdpZHRoPSIwLjU5NiIgaGVpZ2h0PSIxLjE5MiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzQuNDQ4IC0xNy42MzQpIHJvdGF0ZSg5MCkiLz48cmVjdCBjbGFzcz0iY2xzLTQiIHg9IjI1Ljc0MyIgeT0iMTYuNzgzIiB3aWR0aD0iMC41OTYiIGhlaWdodD0iMS4xOTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQzLjQyIC04LjY2Mikgcm90YXRlKDkwKSIvPjxyZWN0IGNsYXNzPSJjbHMtNCIgeD0iMTAuNjYzIiB5PSIyMi43MzciIHdpZHRoPSIwLjU5NiIgaGVpZ2h0PSIxLjE5MiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzQuMjk0IDEyLjM3MSkgcm90YXRlKDkwKSIvPjxyZWN0IGNsYXNzPSJjbHMtNCIgeD0iMTIuMDc3IiB5PSIyNC42MTEiIHdpZHRoPSIwLjU5NiIgaGVpZ2h0PSIxLjE5MiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjQuNzUxIDUwLjQxMykgcm90YXRlKDE4MCkiLz48cmVjdCBjbGFzcz0iY2xzLTQiIHg9IjIzLjY5OSIgeT0iMTguNzg4IiB3aWR0aD0iMS4yMDQiIGhlaWdodD0iMS45NDgiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ0LjA2MyAtNC41MzkpIHJvdGF0ZSg5MCkiLz48cmVjdCBjbGFzcz0iY2xzLTQiIHg9IjIzLjY5OSIgeT0iMjAuMjg4IiB3aWR0aD0iMS4yMDQiIGhlaWdodD0iMS45NDgiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ1LjU2MyAtMy4wMzkpIHJvdGF0ZSg5MCkiLz48cmVjdCBjbGFzcz0iY2xzLTQiIHg9IjI1Ljc0MyIgeT0iMTMuNzkyIiB3aWR0aD0iMC41OTYiIGhlaWdodD0iMS4xOTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQwLjQyOSAtMTEuNjUzKSByb3RhdGUoOTApIi8+PHJlY3QgY2xhc3M9ImNscy00IiB4PSIyNS43NDMiIHk9IjEwLjgwMSIgd2lkdGg9IjAuNTk2IiBoZWlnaHQ9IjEuMTkyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzNy40MzggLTE0LjY0NCkgcm90YXRlKDkwKSIvPjxnIGlkPSJBUkMiPjxyZWN0IGNsYXNzPSJjbHMtNyIgeD0iMjguNjcxIiB5PSI3Ljg0OSIgd2lkdGg9IjEuNDkiIGhlaWdodD0iMS4xMTciLz48L2c+PGcgaWQ9IkFSQy0yIiBkYXRhLW5hbWU9IkFSQyI+PHJlY3QgY2xhc3M9ImNscy03IiB4PSIyOC42NzEiIHk9IjEwLjgzOSIgd2lkdGg9IjEuNDkiIGhlaWdodD0iMS4xMTciLz48L2c+PGcgaWQ9IkFSQy0zIiBkYXRhLW5hbWU9IkFSQyI+PHJlY3QgY2xhc3M9ImNscy03IiB4PSIyOC42NzEiIHk9IjEzLjgzIiB3aWR0aD0iMS40OSIgaGVpZ2h0PSIxLjExNyIvPjwvZz48ZyBpZD0iQVJDLTQiIGRhdGEtbmFtZT0iQVJDIj48cmVjdCBjbGFzcz0iY2xzLTciIHg9IjI4LjY3MSIgeT0iMTYuODIiIHdpZHRoPSIxLjQ5IiBoZWlnaHQ9IjEuMTE3Ii8+PC9nPjxnIGlkPSJBUkMtNSIgZGF0YS1uYW1lPSJBUkMiPjxyZWN0IGNsYXNzPSJjbHMtNyIgeD0iOC4yNzYiIHk9IjIxLjMxNyIgd2lkdGg9IjEuMTE3IiBoZWlnaHQ9IjEuNDkiLz48L2c+PHBhdGggY2xhc3M9ImNscy00IiBkPSJNMTYuMSwyNC43ODlWMjMuNTIyYS4xNDguMTQ4LDAsMCwwLS4xNS0uMTQ3SDE0LjM1NGEuMTQ3LjE0NywwLDAsMC0uMTQ5LjE0N3YzLjQyN2EuMTQ4LjE0OCwwLDAsMCwuMTQ5LjE1aDEuNTkzYS4xNDkuMTQ5LDAsMCwwLC4xNS0uMTVWMjUuNjg1aDB2LS45WiIvPjxwYXRoIGNsYXNzPSJjbHMtNCIgZD0iTTE3Ljk4OSwyNC43ODlWMjMuNTIyYS4xNDguMTQ4LDAsMCwwLS4xNS0uMTQ3SDE2LjI0N2EuMTQ3LjE0NywwLDAsMC0uMTUuMTQ3djMuNDI3YS4xNDguMTQ4LDAsMCwwLC4xNS4xNWgxLjU5MmEuMTQ5LjE0OSwwLDAsMCwuMTUtLjE1VjI1LjY4NWgwdi0uOVoiLz48cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Ik0xOS44ODEsMjQuNzg5VjIzLjUyMmEuMTQ3LjE0NywwLDAsMC0uMTQ5LS4xNDdIMTguMTM5YS4xNDguMTQ4LDAsMCwwLS4xNS4xNDd2My40MjdhLjE0OS4xNDksMCwwLDAsLjE1LjE1aDEuNTkzYS4xNDguMTQ4LDAsMCwwLC4xNDktLjE1VjI1LjY4NWgwdi0uOVoiLz48cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Ik0yMS43NzQsMjQuNzg5VjIzLjUyMmEuMTQ4LjE0OCwwLDAsMC0uMTUtLjE0N0gyMC4wMzFhLjE0OC4xNDgsMCwwLDAtLjE1LjE0N3YzLjQyN2EuMTQ5LjE0OSwwLDAsMCwuMTUuMTVoMS41OTNhLjE0OS4xNDksMCwwLDAsLjE1LS4xNVYyNS42ODVoMHYtLjlaIi8+PHBhdGggY2xhc3M9ImNscy00IiBkPSJNMjMuNjY2LDI0Ljc4OVYyMy41MjJhLjE0OC4xNDgsMCwwLDAtLjE1LS4xNDdIMjEuOTIzYS4xNDcuMTQ3LDAsMCwwLS4xNDkuMTQ3djMuNDI3YS4xNDguMTQ4LDAsMCwwLC4xNDkuMTVoMS41OTNhLjE0OS4xNDksMCwwLDAsLjE1LS4xNVYyNS42ODVoMHYtLjlaIi8+PHBhdGggY2xhc3M9ImNscy02IiBkPSJNMzEuMjQxLDIwLjk0MWgtNC4wM2EuMjIyLjIyMiwwLDAsMC0uMjIuMjJ2NC4wM2EuMjIyLjIyMiwwLDAsMCwuMjIuMjJoNC4wM2EuMjIyLjIyMiwwLDAsMCwuMjItLjIydi00LjAzQS4yMjIuMjIyLDAsMCwwLDMxLjI0MSwyMC45NDFabS0yLjAxLDMuNWExLjI2NSwxLjI2NSwwLDEsMSwxLjI2LTEuMjdBMS4yNjUsMS4yNjUsMCwwLDEsMjkuMjMxLDI0LjQ0MVoiLz48cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Ik0zMC40OTEsMjMuMTcxYTEuMjY1LDEuMjY1LDAsMSwxLTEuMjYtMS4yNkExLjI1NywxLjI1NywwLDAsMSwzMC40OTEsMjMuMTcxWiIvPjxyZWN0IGNsYXNzPSJjbHMtOCIgeD0iMTYuMzg4IiB5PSIyNy43NDMiIHdpZHRoPSIxNi4wMTYiIGhlaWdodD0iNy41NTkiLz48cmVjdCBjbGFzcz0iY2xzLTkiIHg9IjI1LjY5OSIgeT0iMjguNTk3IiB3aWR0aD0iMy43MjUiIGhlaWdodD0iOC45NCIgcng9IjAuMzcyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2MC42MjkgNS41MDUpIHJvdGF0ZSg5MCkiLz48cmVjdCBjbGFzcz0iY2xzLTEwIiB4PSI2LjMyNyIgd2lkdGg9IjI3LjM0NyIgaGVpZ2h0PSI0MCIvPjwvc3ZnPg==';
var AvailableLocales = ['en', 'ja', 'ja-Hira'];
var Message = {
  categoryName: {
    'ja': 'konashi',
    'ja-Hira': 'コナシ',
    'en': 'konashi'
  },
  setPrefix: {
    'ja': 'デバイスを変える: [prefix]',
    'ja-Hira': 'デバイスをかえる: [prefix]',
    'en': 'change device to [prefix]'
  },
  connect: {
    'ja': '接続する',
    'ja-Hira': 'つなぐ',
    'en': 'connect'
  },
  setHigh: {
    'ja': 'PIO [pid] を HIGH にする',
    'ja-Hira': 'PIO [pid] を HIGH にする',
    'en': 'set PIO [pid] to HIGH'
  },
  setLow: {
    'ja': 'PIO [pid] を LOW にする',
    'ja-Hira': 'PIO [pid] を LOW にする',
    'en': 'set PIO [pid] to LOW'
  },
  ledDrive: {
    'ja': 'LED: PIO [pid] を [ratio] にする',
    'ja-Hira': 'LED: PIO [pid] を [ratio] にする',
    'en': 'LED: set PIO [pid] to [ratio]'
  },
  servoDrive: {
    'ja': 'PWM: PIO [pid] を [duty] にする',
    'ja-Hira': 'PWM: PIO [pid] を [duty] にする',
    'en': 'PWM: set PIO [pid] to [duty]'
  },
  analogInputZero: {
    'ja': 'Analog 0',
    'ja-Hira': 'アナログ 0',
    'en': 'Analog 0'
  },
  analogInputOne: {
    'ja': 'Analog 1',
    'ja-Hira': 'アナログ 1',
    'en': 'Analog 1'
  },
  analogInputTwo: {
    'ja': 'Analog 2',
    'ja-Hira': 'アナログ 2',
    'en': 'Analog 2'
  },
  analogRead: {
    'ja': 'Analog: AIO [aio] を読み込む',
    'ja-Hira': 'Analog: AIO [aio] をよみこむ',
    'en': 'Analog: Read AIO [aio]'
  },
  inputDataChanged: {
    'ja': 'PIO [pid] が [high_low] になったとき',
    'ja-Hira': 'PIO [pid] が [high_low] になったとき',
    'en': 'when PIO [pid] became [high_low]'
  },
  digitalInputZero: {
    'ja': 'Digital 0',
    'ja-Hira': 'デジタル 0',
    'en': 'Digital 0'
  },
  digitalInputOne: {
    'ja': 'Digital 1',
    'ja-Hira': 'デジタル 1',
    'en': 'Digital 1'
  },
  digitalInputTwo: {
    'ja': 'Digital 2',
    'ja-Hira': 'デジタル 2',
    'en': 'Digital 2'
  },
  digitalInputThree: {
    'ja': 'Digital 3',
    'ja-Hira': 'デジタル 3',
    'en': 'Digital 3'
  },
  digitalInputFour: {
    'ja': 'Digital 4',
    'ja-Hira': 'デジタル 4',
    'en': 'Digital 4'
  },
  digitalInputFive: {
    'ja': 'Digital 5',
    'ja-Hira': 'デジタル 5',
    'en': 'Digital 5'
  },
  digitalInputSix: {
    'ja': 'Digital 6',
    'ja-Hira': 'デジタル 6',
    'en': 'Digital 6'
  },
  digitalInputSeven: {
    'ja': 'Digital 7',
    'ja-Hira': 'デジタル 7',
    'en': 'Digital 7'
  },
  digitalRead: {
    'ja': 'Digital: PIO [pid] を読み込む',
    'ja-Hira': 'Digital: PIO [pid] をよみこむ',
    'en': 'Digital: Read PIO [pid]'
  },
  connectionState: {
    none: {
      'ja': '左のチェックボックスを押してね',
      'ja-Hira': 'ひだりのしかくをおしてね',
      'en': 'please click the left checkbox'
    },
    not_found: {
      'ja': '見つかりません',
      'ja-Hira': 'みつかりません',
      'en': 'could not connect'
    },
    try: {
      'ja': '接続中',
      'ja-Hira': 'せつぞくちゅう',
      'en': 'connecting...'
    },
    connected: {
      'ja': '接続しました',
      'ja-Hira': 'せつぞくしました',
      'en': 'connected'
    },
    disconnecting: {
      'ja': '切断中',
      'ja-Hira': 'せつだんちゅう',
      'en': 'disconnecting...'
    },
    lost: {
      'ja': '消えました',
      'ja-Hira': 'きえました',
      'en': 'lost connection'
    }
  },
  reset: {
    'ja': 'リセット',
    'ja-Hira': 'リセット',
    'en': 'reset'
  },
  disconnect_alert: {
    'ja': '接続を失いました。再接続するにはチェックボックスを一度外して、初めから接続をしてください。',
    'ja-Hira': 'つなぐことができませんでした。もういちどつなぎたいばあい、チェックボックスをはずして、はじめからやりなおしてください。',
    'en': 'disconnected. release the checkbox of connect block. then re-connect the device.'
  },
  lost_alert: {
    'ja': '接続を失いました。再接続するにはチェックボックスを一度外して、初めから接続をしてください。',
    'ja-Hira': 'つなぐことができませんでした。もういちどつなぎたいばあい、チェックボックスをはずして、はじめからやりなおしてください。',
    'en': 'disconnected. release the checkbox of connect block. then re-connect the device.'
  }
};
var ConnectionState = {
  NONE: 'none',
  NOT_FOUND: 'notfound',
  TRY: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTING: 'disconnecting',
  LOST: 'lost'
};

var KonashiBlocks = /*#__PURE__*/function () {
  function KonashiBlocks(runtime) {
    _classCallCheck(this, KonashiBlocks);

    this._runtime = runtime;

    this._onDigitalInputNotified = function (pin, data) {};

    this._prefix = "konashi";
    this._kokoroPro = new KokoroPro(this._onDigitalInputNotified);
    this._consts = this._kokoroPro.getConsts();
    this._connectionState = ConnectionState.NONE;
    this._alreadyAlert = false;
    this._clicked = false;
    this._intervalId = window.setInterval(this._updateConnectionState, 200, this);
  }

  _createClass(KonashiBlocks, [{
    key: "getInfo",
    value: function getInfo() {
      return {
        id: 'konashi',
        name: Message.categoryName[this.setLocale()],
        menuIconURI: menuIconURI,
        blockIconURI: blockIconURI,
        color1: '#E88283',
        color2: '#CE7475',
        blocks: [{
          opcode: 'setPrefix',
          blockType: BlockType.REPORTER,
          text: Message.setPrefix[this.setLocale()],
          arguments: {
            prefix: {
              type: ArgumentType.STRING,
              defaultValue: "konashi"
            }
          }
        }, {
          opcode: 'connect',
          blockType: BlockType.REPORTER,
          text: Message.connect[this.setLocale()]
        }, '---', {
          opcode: 'setHigh',
          blockType: BlockType.COMMAND,
          text: Message.setHigh[this.setLocale()],
          arguments: {
            pid: {
              type: ArgumentType.NUMBER,
              menu: 'pios',
              defaultValue: 1
            }
          }
        }, {
          opcode: 'setLow',
          blockType: BlockType.COMMAND,
          text: Message.setLow[this.setLocale()],
          arguments: {
            pid: {
              type: ArgumentType.NUMBER,
              menu: 'pios',
              defaultValue: 1
            }
          }
        }, '---', {
          opcode: 'ledDrive',
          blockType: BlockType.COMMAND,
          text: Message.ledDrive[this.setLocale()],
          arguments: {
            pid: {
              type: ArgumentType.NUMBER,
              menu: 'pios',
              defaultValue: 1
            },
            ratio: {
              type: ArgumentType.NUMBER,
              defaultValue: 1,
              alt: '0 から 100 を入れてね'
            }
          }
        }, {
          opcode: 'servoDrive',
          blockType: BlockType.COMMAND,
          text: Message.servoDrive[this.setLocale()],
          arguments: {
            pid: {
              type: ArgumentType.NUMBER,
              menu: 'pios',
              defaultValue: 1
            },
            duty: {
              type: ArgumentType.NUMBER,
              defaultValue: 1,
              alt: '500 から 2500 を入れてね'
            }
          }
        }, '---', {
          opcode: 'returnAnalogInputZero',
          blockType: BlockType.REPORTER,
          text: Message.analogInputZero[this.setLocale()]
        }, {
          opcode: 'returnAnalogInputOne',
          blockType: BlockType.REPORTER,
          text: Message.analogInputOne[this.setLocale()]
        }, {
          opcode: 'returnAnalogInputTwo',
          blockType: BlockType.REPORTER,
          text: Message.analogInputTwo[this.setLocale()]
        }, {
          opcode: 'analogRead',
          blockType: BlockType.COMMAND,
          text: Message.analogRead[this.setLocale()],
          arguments: {
            aio: {
              type: ArgumentType.NUMBER,
              menu: 'aios',
              defaultValue: 0
            }
          }
        }, '---', {
          opcode: 'inputDataChanged',
          blockType: BlockType.HAT,
          text: Message.inputDataChanged[this.setLocale()],
          arguments: {
            pid: {
              type: ArgumentType.NUMBER,
              menu: 'pios',
              defaultValue: 0
            },
            high_low: {
              type: ArgumentType.NUMBER,
              menu: 'values',
              defaultValue: 0
            }
          }
        }, {
          opcode: 'returnDigitalInputZero',
          blockType: BlockType.REPORTER,
          text: Message.digitalInputZero[this.setLocale()]
        }, {
          opcode: 'returnDigitalInputOne',
          blockType: BlockType.REPORTER,
          text: Message.digitalInputOne[this.setLocale()]
        }, {
          opcode: 'returnDigitalInputTwo',
          blockType: BlockType.REPORTER,
          text: Message.digitalInputTwo[this.setLocale()]
        }, {
          opcode: 'returnDigitalInputThree',
          blockType: BlockType.REPORTER,
          text: Message.digitalInputThree[this.setLocale()]
        }, {
          opcode: 'returnDigitalInputFour',
          blockType: BlockType.REPORTER,
          text: Message.digitalInputFour[this.setLocale()]
        }, {
          opcode: 'returnDigitalInputFive',
          blockType: BlockType.REPORTER,
          text: Message.digitalInputFive[this.setLocale()]
        }, {
          opcode: 'returnDigitalInputSix',
          blockType: BlockType.REPORTER,
          text: Message.digitalInputSix[this.setLocale()]
        }, {
          opcode: 'returnDigitalInputSeven',
          blockType: BlockType.REPORTER,
          text: Message.digitalInputSeven[this.setLocale()]
        }, {
          opcode: 'digitalRead',
          blockType: BlockType.COMMAND,
          text: Message.digitalRead[this.setLocale()],
          arguments: {
            pid: {
              type: ArgumentType.NUMBER,
              menu: 'pios',
              defaultValue: 0
            }
          }
        }],
        menus: {
          pios: {
            acceptReporters: true,
            items: this.PIO_MENU
          },
          aios: {
            acceptReporters: true,
            items: this.AIO_MENU
          },
          values: {
            acceptReporters: true,
            items: this.HIGH_LOW_MENU
          }
        }
      };
    }
  }, {
    key: "_updateConnectionState",
    value: function _updateConnectionState(that) {
      var targetBlock = Blockly.getMainWorkspace().getBlockById('konashi_connect');

      if (targetBlock) {
        that._clicked = targetBlock.flyoutCheckbox.clicked;
      } // { first action


      if (that._connectionState == ConnectionState.NONE) {
        if (that._clicked) {
          that._kokoroPro.connect(that._prefix).catch(function (error) {
            log.log(error);
            that._connectionState = ConnectionState.NOT_FOUND; // finish first act
          });

          that._connectionState = ConnectionState.TRY;
        }
      }

      if (that._connectionState == ConnectionState.TRY) {
        if (that._kokoroPro.isConnected()) {
          that._connectionState = ConnectionState.CONNECTED; // finish first act
        }
      }

      if (that._connectionState == ConnectionState.CONNECTED) {
        // Unchecked connect button. second act
        if (!that._clicked) {
          that._connectionState = ConnectionState.DISCONNECTING; // finish second act
        } // when konashi lost (e.g. power down, took usb cables.)


        if (!that._kokoroPro.isConnected()) {
          that._connectionState = ConnectionState.LOST; // finish first act
        }
      } // first act}
      // { third act


      if (that._connectionState == ConnectionState.NOT_FOUND) {
        if (!that._alreadyAlert) {
          alert(Message.lost_alert[that.setLocale()]);
          that._alreadyAlert = true;
        }

        if (!that._clicked) {
          that._reset();
        }
      }

      if (that._connectionState == ConnectionState.LOST) {
        if (!that._alreadyAlert) {
          alert(Message.disconnect_alert[that.setLocale()]);
          that._alreadyAlert = true;
        }

        if (!that._clicked) {
          that._reset();
        }
      } // チェックボックスが外された


      if (that._connectionState == ConnectionState.DISCONNECTING) {
        that._reset();
      } // third act }

    }
    /**
     * 
     * @param {Boolean} alreadyConnected
     * @private
     */

  }, {
    key: "_reset",
    value: function _reset() {
      this._kokoroPro = new KokoroPro();
      this._alreadyAlert = false;
      this._connectionState = ConnectionState.NONE;
    }
    /**
     * @return {array} - text and values for each buttons pin number element
     */

  }, {
    key: "setPrefix",
    value: function setPrefix(args) {
      this._prefix = args.prefix;
      return this._prefix;
    }
  }, {
    key: "connect",
    value: function connect() {
      if (this._connectionState == ConnectionState.NONE) {
        return Message.connectionState.none[this.setLocale()];
      }

      if (this._connectionState == ConnectionState.NOT_FOUND) {
        return Message.connectionState.not_found[this.setLocale()];
      }

      if (this._connectionState == ConnectionState.TRY) {
        return Message.connectionState.try[this.setLocale()];
      }

      if (this._connectionState == ConnectionState.CONNECTED) {
        return Message.connectionState.connected[this.setLocale()];
      }

      if (this._connectionState == ConnectionState.DISCONNECTING) {
        return Message.connectionState.disconnecting[this.setLocale()];
      }

      if (this._connectionState == ConnectionState.LOST) {
        return Message.connectionState.lost[this.setLocale()];
      }

      return 'ERROR';
    }
  }, {
    key: "setHigh",
    value: function setHigh(args) {
      if (!this._kokoroPro.isConnected()) return;

      this._kokoroPro.setOutput(parseInt(args.pid), this._consts.HIGH);
    }
  }, {
    key: "setLow",
    value: function setLow(args) {
      if (!this._kokoroPro.isConnected()) return;

      this._kokoroPro.setOutput(parseInt(args.pid), this._consts.LOW);
    }
  }, {
    key: "ledDrive",
    value: function ledDrive(args) {
      if (!this._kokoroPro.isConnected()) return;

      this._kokoroPro.pwmLedDrive(parseInt(args.pid), args.ratio);
    }
  }, {
    key: "servoDrive",
    value: function servoDrive(args) {
      if (!this._kokoroPro.isConnected()) return;

      this._kokoroPro.pwmServoDrive(parseInt(args.pid), args.duty);
    }
  }, {
    key: "returnAnalogInputZero",
    value: function returnAnalogInputZero() {
      if (!this._kokoroPro.isConnected()) return;
      return this._kokoroPro.getAnalogValue(this._consts.AIO0);
    }
  }, {
    key: "returnAnalogInputOne",
    value: function returnAnalogInputOne() {
      if (!this._kokoroPro.isConnected()) return;
      return this._kokoroPro.getAnalogValue(this._consts.AIO1);
    }
  }, {
    key: "returnAnalogInputTwo",
    value: function returnAnalogInputTwo() {
      if (!this._kokoroPro.isConnected()) return;
      return this._kokoroPro.getAnalogValue(this._consts.AIO2);
    }
  }, {
    key: "analogRead",
    value: function analogRead(args) {
      if (!this._kokoroPro.isConnected()) return;

      this._kokoroPro.analogRead(parseInt(args.aio));
    }
  }, {
    key: "inputDataChanged",
    value: function inputDataChanged(args) {
      var data = this._kokoroPro.getDigitalValue(args.pid);

      if (data == args.high_low) {
        return true;
      }

      return false;
    }
  }, {
    key: "returnDigitalInputZero",
    value: function returnDigitalInputZero() {
      if (!this._kokoroPro.isConnected()) return;
      return this._kokoroPro.getDigitalValue(this._consts.PIO0);
    }
  }, {
    key: "returnDigitalInputOne",
    value: function returnDigitalInputOne() {
      if (!this._kokoroPro.isConnected()) return;
      return this._kokoroPro.getDigitalValue(this._consts.PIO1);
    }
  }, {
    key: "returnDigitalInputTwo",
    value: function returnDigitalInputTwo() {
      if (!this._kokoroPro.isConnected()) return;
      return this._kokoroPro.getDigitalValue(this._consts.PIO2);
    }
  }, {
    key: "returnDigitalInputThree",
    value: function returnDigitalInputThree() {
      if (!this._kokoroPro.isConnected()) return;
      return this._kokoroPro.getDigitalValue(this._consts.PIO3);
    }
  }, {
    key: "returnDigitalInputFour",
    value: function returnDigitalInputFour() {
      if (!this._kokoroPro.isConnected()) return;
      return this._kokoroPro.getDigitalValue(this._consts.PIO4);
    }
  }, {
    key: "returnDigitalInputFive",
    value: function returnDigitalInputFive() {
      if (!this._kokoroPro.isConnected()) return;
      return this._kokoroPro.getDigitalValue(this._consts.PIO5);
    }
  }, {
    key: "returnDigitalInputSix",
    value: function returnDigitalInputSix() {
      if (!this._kokoroPro.isConnected()) return;
      return this._kokoroPro.getDigitalValue(this._consts.PIO6);
    }
  }, {
    key: "returnDigitalInputSeven",
    value: function returnDigitalInputSeven() {
      if (!this._kokoroPro.isConnected()) return;
      return this._kokoroPro.getDigitalValue(this._consts.PIO7);
    }
  }, {
    key: "digitalRead",
    value: function digitalRead(args) {
      if (!this._kokoroPro.isConnected()) return;

      this._kokoroPro.digitalRead(parseInt(args.pid));
    }
  }, {
    key: "setLocale",
    value: function setLocale() {
      var locale = formatMessage.setup().locale;

      if (AvailableLocales.includes(locale)) {
        return locale;
      } else {
        return 'en';
      }
    }
  }, {
    key: "PIO_MENU",
    get: function get() {
      return [{
        text: '0',
        value: '0'
      }, {
        text: '1',
        value: '1'
      }, {
        text: '2',
        value: '2'
      }, {
        text: '3',
        value: '3'
      }, {
        text: '4',
        value: '4'
      }, {
        text: '5',
        value: '5'
      }, {
        text: '6',
        value: '6'
      }, {
        text: '7',
        value: '7'
      }];
    }
  }, {
    key: "AIO_MENU",
    get: function get() {
      return [{
        text: '0',
        value: '0'
      }, {
        text: '1',
        value: '1'
      }, {
        text: '2',
        value: '2'
      }];
    }
  }, {
    key: "HIGH_LOW_MENU",
    get: function get() {
      return [{
        text: 'LOW',
        value: '0'
      }, {
        text: 'HIGH',
        value: '1'
      }];
    }
  }]);

  return KonashiBlocks;
}();

module.exports = KonashiBlocks;
