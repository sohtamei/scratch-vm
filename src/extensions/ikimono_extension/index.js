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

var Cast = require("../../util/cast");

var Kokoro = require("./kokoro.js");
/**
 * Icon png to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
// ブロックの中に表示されるsvg を base64 にして登録


var blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6IzIzMTgxNTt9LmNscy0xLC5jbHMtMiwuY2xzLTMsLmNscy00LC5jbHMtNSwuY2xzLTYsLmNscy03LC5jbHMtOHtzdHJva2U6IzAwMDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7fS5jbHMtMSwuY2xzLTIsLmNscy0zLC5jbHMtNSwuY2xzLTh7c3Ryb2tlLXdpZHRoOjAuMjQxcHg7fS5jbHMtMywuY2xzLTQsLmNscy04e2ZpbGw6I2ZmZjt9LmNscy00LC5jbHMtNiwuY2xzLTd7c3Ryb2tlLXdpZHRoOjAuMDcycHg7fS5jbHMtNXtmaWxsOiNmZjA7fS5jbHMtNiwuY2xzLTl7ZmlsbDojOWZhMGEwO30uY2xzLTd7ZmlsbDojNTk1NzU3O30uY2xzLTh7ZmlsbC1vcGFjaXR5OjAuMjt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPlNjcmF0Y2g8L3RpdGxlPjxnIGlkPSJMV1BPTFlMSU5FIj48cmVjdCBjbGFzcz0iY2xzLTEiIHg9IjE3LjgwNyIgeT0iMS45IiB3aWR0aD0iNC4xOTkiIGhlaWdodD0iMi4xMjMiLz48L2c+PGcgaWQ9IkxXUE9MWUxJTkUtMiIgZGF0YS1uYW1lPSJMV1BPTFlMSU5FIj48cmVjdCBjbGFzcz0iY2xzLTIiIHg9IjE4Ljk0MSIgeT0iMC41IiB3aWR0aD0iMC45NjUiIGhlaWdodD0iMS40Ii8+PC9nPjxwYXRoIGNsYXNzPSJjbHMtMyIgZD0iTTI2LjI3NSwxLjg1NEgxMy43MjZBMS40NDgsMS40NDgsMCwwLDAsMTIuMjc3LDMuM1YzNS4xNTdBMS40NDksMS40NDksMCwwLDAsMTMuNzI2LDM2LjZIMjYuMjc1YTEuNDQ3LDEuNDQ3LDAsMCwwLDEuNDQ4LTEuNDQ3VjMuM0ExLjQ0NiwxLjQ0NiwwLDAsMCwyNi4yNzUsMS44NTRabS0xMS4xLDMzLjNhLjQ4NC40ODQsMCwwLDEtLjQ4Mi40ODJoLS45NjZhLjQ4My40ODMsMCwwLDEtLjQ4My0uNDgydi0uNDg0YS40ODMuNDgzLDAsMCwxLC40ODMtLjQ4MmguOTY2YS40ODQuNDg0LDAsMCwxLC40ODIuNDgyWm0wLTMxLjM3MmEuNDgzLjQ4MywwLDAsMS0uNDgyLjQ4MWgtLjk2NmEuNDgyLjQ4MiwwLDAsMS0uNDgzLS40ODFWMy4zYS40ODIuNDgyLDAsMCwxLC40ODMtLjQ4MmguOTY2YS40ODMuNDgzLDAsMCwxLC40ODIuNDgyWk0yNi43NTcsMzUuMTU3YS40ODMuNDgzLDAsMCwxLS40ODIuNDgySDI1LjMxYS40ODQuNDg0LDAsMCwxLS40ODQtLjQ4MnYtLjQ4NGEuNDg0LjQ4NCwwLDAsMSwuNDg0LS40ODJoLjk2NWEuNDgzLjQ4MywwLDAsMSwuNDgyLjQ4MlptMC0zMS4zNzJhLjQ4Mi40ODIsMCwwLDEtLjQ4Mi40ODFIMjUuMzFhLjQ4My40ODMsMCwwLDEtLjQ4NC0uNDgxVjMuM2EuNDgzLjQ4MywwLDAsMSwuNDg0LS40ODJoLjk2NWEuNDgyLjQ4MiwwLDAsMSwuNDgyLjQ4MloiLz48ZyBpZD0iTFdQT0xZTElORS0zIiBkYXRhLW5hbWU9IkxXUE9MWUxJTkUiPjxyZWN0IGNsYXNzPSJjbHMtNCIgeD0iMTcuNTg5IiB5PSIxNS4zNjYiIHdpZHRoPSI0LjgyNyIgaGVpZ2h0PSI1Ljc5MSIvPjwvZz48cGF0aCBkPSJNMTguNDIyLDguOTdhLjA3OC4wNzgsMCwwLDAtLjA1OC4wMjQuMDc2LjA3NiwwLDAsMC0uMDI1LjA1OFY5LjhhLjI4NS4yODUsMCwwLDEtLjA4Ny4yMDcuMy4zLDAsMCwxLS4yMTEuMDg1LjI5NC4yOTQsMCwwLDEtLjIxLS4wODUuMjgzLjI4MywwLDAsMS0uMDg3LS4yMDdWOS4wNTJhLjA3OC4wNzgsMCwwLDAtLjAyNC0uMDU4LjA4Mi4wODIsMCwwLDAtLjA1OS0uMDI0LjA4NS4wODUsMCwwLDAtLjA2LjAyNC4wNzguMDc4LDAsMCwwLS4wMjMuMDU4VjkuOGEuNDM3LjQzNywwLDAsMCwuMTM1LjMyMS40NzEuNDcxLDAsMCwwLC42NTYsMCwuNDM1LjQzNSwwLDAsMCwuMTM2LS4zMjFWOS4wNTJhLjA3OC4wNzgsMCwwLDAtLjAyNC0uMDU4QS4wODIuMDgyLDAsMCwwLDE4LjQyMiw4Ljk3WiIvPjxwYXRoIGQ9Ik0xNi4zNzYsOC45NzFhLjA3Mi4wNzIsMCwwLDAtLjAzNS0uMDA4LjA2NS4wNjUsMCwwLDAtLjAyNy4wMDUuMDc1LjA3NSwwLDAsMC0uMDQ3LjA0bC0uMzgzLjU2NkwxNS41LDkuMDA4YS4wNzMuMDczLDAsMCwwLS4wNDYtLjA0LjA2OS4wNjksMCwwLDAtLjAyOC0uMDA1LjA3Mi4wNzIsMCwwLDAtLjAzNS4wMDguMDc1LjA3NSwwLDAsMC0uMDQxLjA0Ni4wNjYuMDY2LDAsMCwwLS4wMDYuMDI3LjA3Ni4wNzYsMCwwLDAsLjAwOS4wMzVsLjQ0OC42Njd2LjQzNWEuMDc0LjA3NCwwLDAsMCwuMDI0LjA1Ni4wODIuMDgyLDAsMCwwLC4xMTYsMCwuMDc1LjA3NSwwLDAsMCwuMDI1LS4wNTZWOS43NDZsLjQ0OC0uNjY3YS4wNzYuMDc2LDAsMCwwLC4wMDktLjAzNS4wNjYuMDY2LDAsMCwwLS4wMDYtLjAyN0EuMDc2LjA3NiwwLDAsMCwxNi4zNzYsOC45NzFaIi8+PHBhdGggZD0iTTIwLjUzMiw4Ljk3N2gwQS4wODEuMDgxLDAsMCwwLDIwLjQ3Myw5bC0uNTYzLjUyN1Y5LjA0M2EuMDc0LjA3NCwwLDAsMC0uMDI0LS4wNTYuMDc4LjA3OCwwLDAsMC0uMDU4LS4wMjQuMDguMDgsMCwwLDAtLjA1OC4wMjQuMDc0LjA3NCwwLDAsMC0uMDI0LjA1NnYxLjEzOGEuMDc1LjA3NSwwLDAsMCwuMDI0LjA1Ny4wNzkuMDc5LDAsMCwwLC4wNTguMDIzLjA3OC4wNzgsMCwwLDAsLjA1OC0uMDIzLjA3NS4wNzUsMCwwLDAsLjAyNC0uMDU3VjkuNzEybC41NjMuNTI4YS4wODQuMDg0LDAsMCwwLC4wNTcuMDIxLjA3OS4wNzksMCwwLDAsLjA2LS4wMjUuMDczLjA3MywwLDAsMCwuMDIyLS4wNTR2MGEuMDc1LjA3NSwwLDAsMC0uMDI0LS4wNTdsLS41MzgtLjUuNTM4LS41YS4wNzYuMDc2LDAsMCwwLC4wMjQtLjA1NnYwQS4wNzcuMDc3LDAsMCwwLDIwLjU5LDksLjA4My4wODMsMCwwLDAsMjAuNTMyLDguOTc3WiIvPjxwYXRoIGQ9Ik0yMi4yNzksOS4wMTNhLjA5Mi4wOTIsMCwwLDAtLjAzMS0uMDM3LjA4Mi4wODIsMCwwLDAtLjA0Ni0uMDEzLjA3Ny4wNzcsMCwwLDAtLjA0NS4wMTMuMDg1LjA4NSwwLDAsMC0uMDMxLjAzN2wtLjQ2NywxLjEzN2EuMDc5LjA3OSwwLDAsMCwwLC4wNjIuMDc2LjA3NiwwLDAsMCwuMDQ1LjA0My4wODYuMDg2LDAsMCwwLC4wNjMsMCwuMDc5LjA3OSwwLDAsMCwuMDQ0LS4wNDRsLjExOC0uMjg1aC41NDZsLjExNy4yODVhLjA4NS4wODUsMCwwLDAsLjAzMS4wMzcuMDc3LjA3NywwLDAsMCwuMDQ1LjAxMy4wNzMuMDczLDAsMCwwLC4wMy0uMDA2LjA4MS4wODEsMCwwLDAsLjA0Ni0uMDQzLjA4My4wODMsMCwwLDAsMC0uMDYyWk0yMiw5Ljc2NWwuMjA3LS41MDcuMjA4LjUwN1oiLz48cGF0aCBkPSJNMjQuMDE2LDguOTZhLjA3Ny4wNzcsMCwwLDAtLjA1OC4wMjUuMDc0LjA3NCwwLDAsMC0uMDI0LjA1NnYxLjE0MmEuMDc0LjA3NCwwLDAsMCwuMDI0LjA1Ni4wNzcuMDc3LDAsMCwwLC4wNTguMDI1LjA3Ni4wNzYsMCwwLDAsLjA1OC0uMDI1LjA3NC4wNzQsMCwwLDAsLjAyNC0uMDU2VjkuMDQxYS4wNzQuMDc0LDAsMCwwLS4wMjQtLjA1NkEuMDc2LjA3NiwwLDAsMCwyNC4wMTYsOC45NloiLz48cmVjdCBjbGFzcz0iY2xzLTUiIHg9IjE2LjEyNSIgeT0iMzYuNjA0IiB3aWR0aD0iMC4zNjIiIGhlaWdodD0iMi44OTYiLz48cmVjdCBjbGFzcz0iY2xzLTUiIHg9IjE3LjM1MSIgeT0iMzYuNjA0IiB3aWR0aD0iMC4zNjIiIGhlaWdodD0iMi44OTYiLz48cmVjdCBjbGFzcz0iY2xzLTUiIHg9IjIyLjI3OCIgeT0iMzYuNjA0IiB3aWR0aD0iMC4zNjIiIGhlaWdodD0iMi44OTYiLz48cmVjdCBjbGFzcz0iY2xzLTUiIHg9IjIzLjUwNCIgeT0iMzYuNjA0IiB3aWR0aD0iMC4zNjIiIGhlaWdodD0iMi44OTYiLz48ZyBpZD0iTFdQT0xZTElORS00IiBkYXRhLW5hbWU9IkxXUE9MWUxJTkUiPjxyZWN0IGNsYXNzPSJjbHMtNiIgeD0iMjQuMTA1IiB5PSIxNy4xNzYiIHdpZHRoPSIzLjEzOCIgaGVpZ2h0PSIzLjEzNiIvPjwvZz48cmVjdCBjbGFzcz0iY2xzLTciIHg9IjIyLjM2OCIgeT0iMjUuMzU3IiB3aWR0aD0iMC4zODYiIGhlaWdodD0iMC43NzIiLz48cmVjdCBjbGFzcz0iY2xzLTciIHg9IjE4LjAyNCIgeT0iMjUuNTAyIiB3aWR0aD0iMS41NDQiIGhlaWdodD0iMC40ODMiLz48cmVjdCBjbGFzcz0iY2xzLTciIHg9IjIwLjA5OSIgeT0iMjUuNTAyIiB3aWR0aD0iMS41NDQiIGhlaWdodD0iMC40ODMiLz48cmVjdCBjbGFzcz0iY2xzLTciIHg9IjE5LjU2OCIgeT0iMzEuMDA0IiB3aWR0aD0iMS40NDgiIGhlaWdodD0iMC45NjUiLz48cGF0aCBjbGFzcz0iY2xzLTgiIGQ9Ik0yNy43MjIsMzUuMTUxVjIxLjIzYS40ODIuNDgyLDAsMCwwLS40ODItLjQ4bDAsMEgyMy4xdjBhLjQ4Mi40ODIsMCwwLDEtLjQ4Mi0uNDgyVjE3LjIyN2EuNDgyLjQ4MiwwLDAsMSwuNDgyLS40OHYwaDQuMTM4bDAsMGEuNDgyLjQ4MiwwLDAsMCwuNDgyLS40ODJWMy4zMDlhMS40NDcsMS40NDcsMCwwLDAtMS40NDctMS40NDVsMC0uMDA1SDEzLjczdi4wMDVhMS40NDcsMS40NDcsMCwwLDAtMS40NDcsMS40NDVoMHYzMS44NGwwLDBBMS40NDgsMS40NDgsMCwwLDAsMTMuNzI4LDM2LjZIMjYuMjc1QTEuNDQ4LDEuNDQ4LDAsMCwwLDI3LjcyMiwzNS4xNTFaTTE3LjksMi4zNjRIMjEuOTFhLjYwNi42MDYsMCwwLDEsMCwxLjIxMWwwLS4wMDZoLTR2LjAwNmEuNjA2LjYwNiwwLDAsMSwwLTEuMjExWm0tNC4xNzYsMS45MWEuNDgyLjQ4MiwwLDAsMS0uNDgtLjQ4MnYtLjQ4YS40ODIuNDgyLDAsMCwxLC40ODItLjQ4M1YyLjgyNGguOTYzbDAsLjAwNWEuNDgzLjQ4MywwLDAsMSwuNDgzLjQ4aC0uMDA2di40OGwwLC4wNTJhLjQ4My40ODMsMCwwLDEtLjQ4LjQzM1ptMTEuNTc5LDBhLjQ4Mi40ODIsMCwwLDEtLjQ3OS0uNDgyVjMuMzA5YS40ODIuNDgyLDAsMCwxLC40ODItLjQ4VjIuODI0aC45NjJsMCwuMDA1YS40ODIuNDgyLDAsMCwxLC40ODIuNDh2LjQ4M2EuNDgyLjQ4MiwwLDAsMS0uNDgyLjQ4MlptLTkuMDQyLDIuM2EuNjA1LjYwNSwwLDEsMSwuNjA1LjYwNUEuNjA1LjYwNSwwLDAsMSwxNi4yNjUsNi41NzlabTYuMjcsMGEuNjA1LjYwNSwwLDEsMSwuNjA1LjYwNUEuNjA1LjYwNSwwLDAsMSwyMi41MzUsNi41NzlabTEuMTUxLDI3LjQ4N2EuNi42LDAsMCwxLDAsMS4yMWwwLS4wMDVIMjIuNDYxdi4wMDVhLjYwNS42MDUsMCwwLDEsMC0xLjIxWk0xNi44NzUsMzNhLjQ4Mi40ODIsMCwwLDEtLjQ4Mi0uNDgyVjI1LjA5YS40ODIuNDgyLDAsMCwxLC40ODItLjQ4djBoNi4yNTJsMCwwYS40ODIuNDgyLDAsMCwxLC40ODIuNDhoMHY3LjQyNGwwLDBBLjQ4Mi40ODIsMCwwLDEsMjMuMTMsMzNsMC0uMDA1SDE2Ljg3NVptLjY1OSwxLjA2N2EuNi42LDAsMCwxLDAsMS4yMWwwLS4wMDVIMTYuMzA5di4wMDVhLjYwNS42MDUsMCwwLDEsMC0xLjIxWm0tMy44MDYsMS41NjhhLjQ4My40ODMsMCwwLDEtLjQ4LS40ODN2LS40OGEuNDgyLjQ4MiwwLDAsMSwuNDgyLS40ODJ2LS4wMDVoLjk2M2wwLC4wMDVhLjQ4My40ODMsMCwwLDEsLjQ4My40OGgtLjAwNnYuNDhsMCwuMDUyYS40ODMuNDgzLDAsMCwxLS40OC40MzNabTExLjU3OSwwYS40ODIuNDgyLDAsMCwxLS40NzktLjQ4M3YtLjQ4MmEuNDgyLjQ4MiwwLDAsMSwuNDgyLS40OHYtLjAwNWguOTYybDAsLjAwNWEuNDgyLjQ4MiwwLDAsMSwuNDgyLjQ4di40ODJhLjQ4Mi40ODIsMCwwLDEtLjQ4Mi40ODNaIi8+PHJlY3QgY2xhc3M9ImNscy05IiB4PSIxOC41MDUiIHk9IjE2LjAxOSIgd2lkdGg9IjIuOTk1IiBoZWlnaHQ9IjIuOTk1Ii8+PC9zdmc+'; // Scratch画面左のブロックmenu に表示されるsvg を base64にして登録

var menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6IzIzMTgxNTt9LmNscy0xLC5jbHMtMiwuY2xzLTMsLmNscy00LC5jbHMtNSwuY2xzLTYsLmNscy03LC5jbHMtOHtzdHJva2U6IzAwMDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7fS5jbHMtMSwuY2xzLTIsLmNscy0zLC5jbHMtNSwuY2xzLTh7c3Ryb2tlLXdpZHRoOjAuMjQxcHg7fS5jbHMtMywuY2xzLTQsLmNscy04e2ZpbGw6I2ZmZjt9LmNscy00LC5jbHMtNiwuY2xzLTd7c3Ryb2tlLXdpZHRoOjAuMDcycHg7fS5jbHMtNXtmaWxsOiNmZjA7fS5jbHMtNiwuY2xzLTl7ZmlsbDojOWZhMGEwO30uY2xzLTd7ZmlsbDojNTk1NzU3O30uY2xzLTh7ZmlsbC1vcGFjaXR5OjAuMjt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPlNjcmF0Y2g8L3RpdGxlPjxnIGlkPSJMV1BPTFlMSU5FIj48cmVjdCBjbGFzcz0iY2xzLTEiIHg9IjE3LjgwNyIgeT0iMS45IiB3aWR0aD0iNC4xOTkiIGhlaWdodD0iMi4xMjMiLz48L2c+PGcgaWQ9IkxXUE9MWUxJTkUtMiIgZGF0YS1uYW1lPSJMV1BPTFlMSU5FIj48cmVjdCBjbGFzcz0iY2xzLTIiIHg9IjE4Ljk0MSIgeT0iMC41IiB3aWR0aD0iMC45NjUiIGhlaWdodD0iMS40Ii8+PC9nPjxwYXRoIGNsYXNzPSJjbHMtMyIgZD0iTTI2LjI3NSwxLjg1NEgxMy43MjZBMS40NDgsMS40NDgsMCwwLDAsMTIuMjc3LDMuM1YzNS4xNTdBMS40NDksMS40NDksMCwwLDAsMTMuNzI2LDM2LjZIMjYuMjc1YTEuNDQ3LDEuNDQ3LDAsMCwwLDEuNDQ4LTEuNDQ3VjMuM0ExLjQ0NiwxLjQ0NiwwLDAsMCwyNi4yNzUsMS44NTRabS0xMS4xLDMzLjNhLjQ4NC40ODQsMCwwLDEtLjQ4Mi40ODJoLS45NjZhLjQ4My40ODMsMCwwLDEtLjQ4My0uNDgydi0uNDg0YS40ODMuNDgzLDAsMCwxLC40ODMtLjQ4MmguOTY2YS40ODQuNDg0LDAsMCwxLC40ODIuNDgyWm0wLTMxLjM3MmEuNDgzLjQ4MywwLDAsMS0uNDgyLjQ4MWgtLjk2NmEuNDgyLjQ4MiwwLDAsMS0uNDgzLS40ODFWMy4zYS40ODIuNDgyLDAsMCwxLC40ODMtLjQ4MmguOTY2YS40ODMuNDgzLDAsMCwxLC40ODIuNDgyWk0yNi43NTcsMzUuMTU3YS40ODMuNDgzLDAsMCwxLS40ODIuNDgySDI1LjMxYS40ODQuNDg0LDAsMCwxLS40ODQtLjQ4MnYtLjQ4NGEuNDg0LjQ4NCwwLDAsMSwuNDg0LS40ODJoLjk2NWEuNDgzLjQ4MywwLDAsMSwuNDgyLjQ4MlptMC0zMS4zNzJhLjQ4Mi40ODIsMCwwLDEtLjQ4Mi40ODFIMjUuMzFhLjQ4My40ODMsMCwwLDEtLjQ4NC0uNDgxVjMuM2EuNDgzLjQ4MywwLDAsMSwuNDg0LS40ODJoLjk2NWEuNDgyLjQ4MiwwLDAsMSwuNDgyLjQ4MloiLz48ZyBpZD0iTFdQT0xZTElORS0zIiBkYXRhLW5hbWU9IkxXUE9MWUxJTkUiPjxyZWN0IGNsYXNzPSJjbHMtNCIgeD0iMTcuNTg5IiB5PSIxNS4zNjYiIHdpZHRoPSI0LjgyNyIgaGVpZ2h0PSI1Ljc5MSIvPjwvZz48cGF0aCBkPSJNMTguNDIyLDguOTdhLjA3OC4wNzgsMCwwLDAtLjA1OC4wMjQuMDc2LjA3NiwwLDAsMC0uMDI1LjA1OFY5LjhhLjI4NS4yODUsMCwwLDEtLjA4Ny4yMDcuMy4zLDAsMCwxLS4yMTEuMDg1LjI5NC4yOTQsMCwwLDEtLjIxLS4wODUuMjgzLjI4MywwLDAsMS0uMDg3LS4yMDdWOS4wNTJhLjA3OC4wNzgsMCwwLDAtLjAyNC0uMDU4LjA4Mi4wODIsMCwwLDAtLjA1OS0uMDI0LjA4NS4wODUsMCwwLDAtLjA2LjAyNC4wNzguMDc4LDAsMCwwLS4wMjMuMDU4VjkuOGEuNDM3LjQzNywwLDAsMCwuMTM1LjMyMS40NzEuNDcxLDAsMCwwLC42NTYsMCwuNDM1LjQzNSwwLDAsMCwuMTM2LS4zMjFWOS4wNTJhLjA3OC4wNzgsMCwwLDAtLjAyNC0uMDU4QS4wODIuMDgyLDAsMCwwLDE4LjQyMiw4Ljk3WiIvPjxwYXRoIGQ9Ik0xNi4zNzYsOC45NzFhLjA3Mi4wNzIsMCwwLDAtLjAzNS0uMDA4LjA2NS4wNjUsMCwwLDAtLjAyNy4wMDUuMDc1LjA3NSwwLDAsMC0uMDQ3LjA0bC0uMzgzLjU2NkwxNS41LDkuMDA4YS4wNzMuMDczLDAsMCwwLS4wNDYtLjA0LjA2OS4wNjksMCwwLDAtLjAyOC0uMDA1LjA3Mi4wNzIsMCwwLDAtLjAzNS4wMDguMDc1LjA3NSwwLDAsMC0uMDQxLjA0Ni4wNjYuMDY2LDAsMCwwLS4wMDYuMDI3LjA3Ni4wNzYsMCwwLDAsLjAwOS4wMzVsLjQ0OC42Njd2LjQzNWEuMDc0LjA3NCwwLDAsMCwuMDI0LjA1Ni4wODIuMDgyLDAsMCwwLC4xMTYsMCwuMDc1LjA3NSwwLDAsMCwuMDI1LS4wNTZWOS43NDZsLjQ0OC0uNjY3YS4wNzYuMDc2LDAsMCwwLC4wMDktLjAzNS4wNjYuMDY2LDAsMCwwLS4wMDYtLjAyN0EuMDc2LjA3NiwwLDAsMCwxNi4zNzYsOC45NzFaIi8+PHBhdGggZD0iTTIwLjUzMiw4Ljk3N2gwQS4wODEuMDgxLDAsMCwwLDIwLjQ3Myw5bC0uNTYzLjUyN1Y5LjA0M2EuMDc0LjA3NCwwLDAsMC0uMDI0LS4wNTYuMDc4LjA3OCwwLDAsMC0uMDU4LS4wMjQuMDguMDgsMCwwLDAtLjA1OC4wMjQuMDc0LjA3NCwwLDAsMC0uMDI0LjA1NnYxLjEzOGEuMDc1LjA3NSwwLDAsMCwuMDI0LjA1Ny4wNzkuMDc5LDAsMCwwLC4wNTguMDIzLjA3OC4wNzgsMCwwLDAsLjA1OC0uMDIzLjA3NS4wNzUsMCwwLDAsLjAyNC0uMDU3VjkuNzEybC41NjMuNTI4YS4wODQuMDg0LDAsMCwwLC4wNTcuMDIxLjA3OS4wNzksMCwwLDAsLjA2LS4wMjUuMDczLjA3MywwLDAsMCwuMDIyLS4wNTR2MGEuMDc1LjA3NSwwLDAsMC0uMDI0LS4wNTdsLS41MzgtLjUuNTM4LS41YS4wNzYuMDc2LDAsMCwwLC4wMjQtLjA1NnYwQS4wNzcuMDc3LDAsMCwwLDIwLjU5LDksLjA4My4wODMsMCwwLDAsMjAuNTMyLDguOTc3WiIvPjxwYXRoIGQ9Ik0yMi4yNzksOS4wMTNhLjA5Mi4wOTIsMCwwLDAtLjAzMS0uMDM3LjA4Mi4wODIsMCwwLDAtLjA0Ni0uMDEzLjA3Ny4wNzcsMCwwLDAtLjA0NS4wMTMuMDg1LjA4NSwwLDAsMC0uMDMxLjAzN2wtLjQ2NywxLjEzN2EuMDc5LjA3OSwwLDAsMCwwLC4wNjIuMDc2LjA3NiwwLDAsMCwuMDQ1LjA0My4wODYuMDg2LDAsMCwwLC4wNjMsMCwuMDc5LjA3OSwwLDAsMCwuMDQ0LS4wNDRsLjExOC0uMjg1aC41NDZsLjExNy4yODVhLjA4NS4wODUsMCwwLDAsLjAzMS4wMzcuMDc3LjA3NywwLDAsMCwuMDQ1LjAxMy4wNzMuMDczLDAsMCwwLC4wMy0uMDA2LjA4MS4wODEsMCwwLDAsLjA0Ni0uMDQzLjA4My4wODMsMCwwLDAsMC0uMDYyWk0yMiw5Ljc2NWwuMjA3LS41MDcuMjA4LjUwN1oiLz48cGF0aCBkPSJNMjQuMDE2LDguOTZhLjA3Ny4wNzcsMCwwLDAtLjA1OC4wMjUuMDc0LjA3NCwwLDAsMC0uMDI0LjA1NnYxLjE0MmEuMDc0LjA3NCwwLDAsMCwuMDI0LjA1Ni4wNzcuMDc3LDAsMCwwLC4wNTguMDI1LjA3Ni4wNzYsMCwwLDAsLjA1OC0uMDI1LjA3NC4wNzQsMCwwLDAsLjAyNC0uMDU2VjkuMDQxYS4wNzQuMDc0LDAsMCwwLS4wMjQtLjA1NkEuMDc2LjA3NiwwLDAsMCwyNC4wMTYsOC45NloiLz48cmVjdCBjbGFzcz0iY2xzLTUiIHg9IjE2LjEyNSIgeT0iMzYuNjA0IiB3aWR0aD0iMC4zNjIiIGhlaWdodD0iMi44OTYiLz48cmVjdCBjbGFzcz0iY2xzLTUiIHg9IjE3LjM1MSIgeT0iMzYuNjA0IiB3aWR0aD0iMC4zNjIiIGhlaWdodD0iMi44OTYiLz48cmVjdCBjbGFzcz0iY2xzLTUiIHg9IjIyLjI3OCIgeT0iMzYuNjA0IiB3aWR0aD0iMC4zNjIiIGhlaWdodD0iMi44OTYiLz48cmVjdCBjbGFzcz0iY2xzLTUiIHg9IjIzLjUwNCIgeT0iMzYuNjA0IiB3aWR0aD0iMC4zNjIiIGhlaWdodD0iMi44OTYiLz48ZyBpZD0iTFdQT0xZTElORS00IiBkYXRhLW5hbWU9IkxXUE9MWUxJTkUiPjxyZWN0IGNsYXNzPSJjbHMtNiIgeD0iMjQuMTA1IiB5PSIxNy4xNzYiIHdpZHRoPSIzLjEzOCIgaGVpZ2h0PSIzLjEzNiIvPjwvZz48cmVjdCBjbGFzcz0iY2xzLTciIHg9IjIyLjM2OCIgeT0iMjUuMzU3IiB3aWR0aD0iMC4zODYiIGhlaWdodD0iMC43NzIiLz48cmVjdCBjbGFzcz0iY2xzLTciIHg9IjE4LjAyNCIgeT0iMjUuNTAyIiB3aWR0aD0iMS41NDQiIGhlaWdodD0iMC40ODMiLz48cmVjdCBjbGFzcz0iY2xzLTciIHg9IjIwLjA5OSIgeT0iMjUuNTAyIiB3aWR0aD0iMS41NDQiIGhlaWdodD0iMC40ODMiLz48cmVjdCBjbGFzcz0iY2xzLTciIHg9IjE5LjU2OCIgeT0iMzEuMDA0IiB3aWR0aD0iMS40NDgiIGhlaWdodD0iMC45NjUiLz48cGF0aCBjbGFzcz0iY2xzLTgiIGQ9Ik0yNy43MjIsMzUuMTUxVjIxLjIzYS40ODIuNDgyLDAsMCwwLS40ODItLjQ4bDAsMEgyMy4xdjBhLjQ4Mi40ODIsMCwwLDEtLjQ4Mi0uNDgyVjE3LjIyN2EuNDgyLjQ4MiwwLDAsMSwuNDgyLS40OHYwaDQuMTM4bDAsMGEuNDgyLjQ4MiwwLDAsMCwuNDgyLS40ODJWMy4zMDlhMS40NDcsMS40NDcsMCwwLDAtMS40NDctMS40NDVsMC0uMDA1SDEzLjczdi4wMDVhMS40NDcsMS40NDcsMCwwLDAtMS40NDcsMS40NDVoMHYzMS44NGwwLDBBMS40NDgsMS40NDgsMCwwLDAsMTMuNzI4LDM2LjZIMjYuMjc1QTEuNDQ4LDEuNDQ4LDAsMCwwLDI3LjcyMiwzNS4xNTFaTTE3LjksMi4zNjRIMjEuOTFhLjYwNi42MDYsMCwwLDEsMCwxLjIxMWwwLS4wMDZoLTR2LjAwNmEuNjA2LjYwNiwwLDAsMSwwLTEuMjExWm0tNC4xNzYsMS45MWEuNDgyLjQ4MiwwLDAsMS0uNDgtLjQ4MnYtLjQ4YS40ODIuNDgyLDAsMCwxLC40ODItLjQ4M1YyLjgyNGguOTYzbDAsLjAwNWEuNDgzLjQ4MywwLDAsMSwuNDgzLjQ4aC0uMDA2di40OGwwLC4wNTJhLjQ4My40ODMsMCwwLDEtLjQ4LjQzM1ptMTEuNTc5LDBhLjQ4Mi40ODIsMCwwLDEtLjQ3OS0uNDgyVjMuMzA5YS40ODIuNDgyLDAsMCwxLC40ODItLjQ4VjIuODI0aC45NjJsMCwuMDA1YS40ODIuNDgyLDAsMCwxLC40ODIuNDh2LjQ4M2EuNDgyLjQ4MiwwLDAsMS0uNDgyLjQ4MlptLTkuMDQyLDIuM2EuNjA1LjYwNSwwLDEsMSwuNjA1LjYwNUEuNjA1LjYwNSwwLDAsMSwxNi4yNjUsNi41NzlabTYuMjcsMGEuNjA1LjYwNSwwLDEsMSwuNjA1LjYwNUEuNjA1LjYwNSwwLDAsMSwyMi41MzUsNi41NzlabTEuMTUxLDI3LjQ4N2EuNi42LDAsMCwxLDAsMS4yMWwwLS4wMDVIMjIuNDYxdi4wMDVhLjYwNS42MDUsMCwwLDEsMC0xLjIxWk0xNi44NzUsMzNhLjQ4Mi40ODIsMCwwLDEtLjQ4Mi0uNDgyVjI1LjA5YS40ODIuNDgyLDAsMCwxLC40ODItLjQ4djBoNi4yNTJsMCwwYS40ODIuNDgyLDAsMCwxLC40ODIuNDhoMHY3LjQyNGwwLDBBLjQ4Mi40ODIsMCwwLDEsMjMuMTMsMzNsMC0uMDA1SDE2Ljg3NVptLjY1OSwxLjA2N2EuNi42LDAsMCwxLDAsMS4yMWwwLS4wMDVIMTYuMzA5di4wMDVhLjYwNS42MDUsMCwwLDEsMC0xLjIxWm0tMy44MDYsMS41NjhhLjQ4My40ODMsMCwwLDEtLjQ4LS40ODN2LS40OGEuNDgyLjQ4MiwwLDAsMSwuNDgyLS40ODJ2LS4wMDVoLjk2M2wwLC4wMDVhLjQ4My40ODMsMCwwLDEsLjQ4My40OGgtLjAwNnYuNDhsMCwuMDUyYS40ODMuNDgzLDAsMCwxLS40OC40MzNabTExLjU3OSwwYS40ODIuNDgyLDAsMCwxLS40NzktLjQ4M3YtLjQ4MmEuNDgyLjQ4MiwwLDAsMSwuNDgyLS40OHYtLjAwNWguOTYybDAsLjAwNWEuNDgyLjQ4MiwwLDAsMSwuNDgyLjQ4di40ODJhLjQ4Mi40ODIsMCwwLDEtLjQ4Mi40ODNaIi8+PHJlY3QgY2xhc3M9ImNscy05IiB4PSIxOC41MDUiIHk9IjE2LjAxOSIgd2lkdGg9IjIuOTk1IiBoZWlnaHQ9IjIuOTk1Ii8+PC9zdmc+'; // この拡張機能で有効な多言語表示
// すぐ下のMessage の key に登録した locale と同じにしてください。

var AvailableLocales = ['en', 'ja', 'ja-Hira']; // 多言語化に使用するjsonです。
// setLocale 関数を使って、現在のlocaleを読み込み、現在の言語の文言を取得するようにしています。
// 使用例としては、Message.motor_right[this.setLocale()]

var Message = {
  categoryName: {
    'ja': 'ココロキット',
    'ja-Hira': 'ココロキット',
    'en': 'cocoro kit'
  },
  setPrefix: {
    'ja': 'ID: [prefix]',
    'ja-Hira': 'ID: [prefix]',
    'en': 'ID: [prefix]'
  },
  connect: {
    'ja': '接続する',
    'ja-Hira': 'つなぐ',
    'en': 'connect'
  },
  motor_right: {
    'ja': '右',
    'ja-Hira': 'みぎ',
    'en': 'right'
  },
  motor_left: {
    'ja': '左',
    'ja-Hira': 'ひだり',
    'en': 'left'
  },
  connectionState: {
    none: {
      'ja': '左のチェックボックスを押してね',
      'ja-Hira': 'ひだりのしかくをおしてね',
      'en': 'please click the left checkbox'
    },
    not_found: {
      'ja': '接続できませんでした',
      'ja-Hira': 'つなげられませんでした',
      'en': 'could not connect'
    },
    try: {
      'ja': '接続中...',
      'ja-Hira': 'つないでいます...',
      'en': 'connecting...'
    },
    connected: {
      'ja': '接続しました',
      'ja-Hira': 'つなぎました',
      'en': 'connected'
    },
    disconnecting: {
      'ja': '切断中',
      'ja-Hira': 'きっています',
      'en': 'disconnecting...'
    },
    lost: {
      'ja': '接続を失いました',
      'ja-Hira': 'きえてしまいました',
      'en': 'lost connection'
    }
  },
  spinMotor: {
    'ja': '[motor] のモータを [ratio] で回転',
    'ja-Hira': '[motor] のモータを [ratio] でまわす',
    'en': '[motor] motor spin by [ratio]'
  },
  reverseMotor: {
    'ja': '[motor] のモータを [ratio] で逆回転',
    'ja-Hira': '[motor] のモータをぎゃくに [ratio] でまわす',
    'en': '[motor] motor reverse by [ratio]'
  },
  stopMotor: {
    'ja': '[motor] のモータを止める',
    'ja-Hira': '[motor] のモータをとめる',
    'en': '[motor] motor stop'
  },
  changeLed: {
    'ja': '[color] を [ratio] にする',
    'ja-Hira': '[color] を [ratio] にする',
    'en': 'set [color] to [ratio]'
  },
  color: {
    red: {
      'ja': '赤',
      'ja-Hira': 'あか',
      'en': 'red'
    },
    green: {
      'ja': '緑',
      'ja-Hira': 'みどり',
      'en': 'green'
    },
    blue: {
      'ja': '青',
      'ja-Hira': 'あお',
      'en': 'blue'
    }
  },
  reset: {
    'ja': 'リセット [reset_type]',
    'ja-Hira': 'リセット [reset_type]',
    'en': 'reset [reset_type]'
  },
  reset_type: {
    all: {
      'ja': '全て',
      'ja-Hira': 'すべて',
      'en': 'all'
    },
    motor: {
      'ja': 'モータ',
      'ja-Hira': 'モータ',
      'en': 'motor'
    },
    led: {
      'ja': 'LED',
      'ja-Hira': 'LED',
      'en': 'LED'
    }
  },
  disconnect_alert: {
    'ja': '接続を失いました。再接続するにはチェックボックスを一度外して、初めから接続をしてください。詳細はヘルプブロックを押して説明ページをご覧ください。',
    'ja-Hira': 'つなぐことができませんでした。もういちどつなぎたいばあい、チェックボックスをはずして、はじめからやりなおしてください。くわしくはヘルプブロックをおしてかくにんしてください。',
    'en': 'disconnected. release the checkbox of connect block. then re-connect the device.'
  },
  lost_alert: {
    'ja': '接続を失いました。再接続するにはチェックボックスを一度外して、初めから接続をしてください。詳細はヘルプブロックを押して説明ページをご覧ください。',
    'ja-Hira': 'つなぐことができませんでした。もういちどつなぎたいばあい、チェックボックスをはずして、はじめからやりなおしてください。くわしくはヘルプブロックをおしてかくにんしてください。',
    'en': 'disconnected. release the checkbox of connect block. then re-connect the device.'
  },
  help: {
    'ja': '[link] についてヘルプを開く',
    'ja-Hira': '[link] についてヘルプをひらく',
    'en': 'open help for [link]'
  },
  help_links: {
    general: {
      'ja': '全般',
      'ja-Hira': 'ぜんぱん',
      'en': 'general'
    },
    connect: {
      'ja': 'つながらないとき',
      'ja-Hira': 'つながらないとき',
      'en': 'cannot connect'
    },
    lost: {
      'ja': 'うまく動かない',
      'ja-Hira': 'うまくうごかない',
      'en': 'not work'
    },
    blocks: {
      'ja': '各ブロック',
      'ja-Hira': 'ブロック',
      'en': 'blocks'
    }
  }
}; // 現在の接続状況を示した enum 

var ConnectionState = {
  NONE: 'none',
  NOT_FOUND: 'notfound',
  TRY: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTING: 'disconnecting',
  LOST: 'lost'
}; // モータに関連したブロックで、選択リストに表示される

var MOTORS = {
  RIGHT: 'right',
  LEFT: 'left'
}; // リセットブロックで、選択リストに表示される

var RESET_TYPE = {
  ALL: 'all',
  MOTOR: 'motor',
  LED: 'led'
}; // ココロキットのPIN割り当てに対応して、右足左足を正回転にするためのHIGH, LOW指定

var SPIN_MOTOR = {
  RIGHT: {
    HIGH_PIN: 1,
    LOW_PIN: 2
  },
  LEFT: {
    HIGH_PIN: 4,
    LOW_PIN: 3
  }
}; // ココロキットのPIN割り当てに対応して、右足左足を逆回転にするためのHIGH, LOW指定

var REVERSE_MOTOR = {
  RIGHT: {
    HIGH_PIN: 2,
    LOW_PIN: 1
  },
  LEFT: {
    HIGH_PIN: 3,
    LOW_PIN: 4
  }
}; // ココロキットのPIN割り当てに対応したLEDの色

var LED_COLOR = {
  RED: '5',
  GREEN: '6',
  BLUE: '7'
}; // HELP ブロックの選択リストに表示されるアイテムのenum

var LINK_LIST = {
  GENERAL: 'general',
  CONNECT: 'connect',
  LOST: 'reconnect',
  BLOCKS: 'bloks'
}; // HELP ブロックの選択リストに表示されるアイテムのURL

var url_general_help = "https://note.com/kurikit";
var url_connect_help = "https://note.com/kurikit/n/nf28bd0b31d28";
var url_reconnect_help = "https://note.com/kurikit/n/n983ee0d9b7a6";
var url_blocks_help = "https://note.com/kurikit/n/nfd783e7ecc41"; // 探索する Bluetooth の Device名（prefixを登録して探索する）

var PREFIX = "cocorokit-02";

var IkimonoBlocks = /*#__PURE__*/function () {
  function IkimonoBlocks(runtime) {
    _classCallCheck(this, IkimonoBlocks);

    this._runtime = runtime;
    this._ID = ""; // このIDはココロキットの後ろのシールに記載してある ID なので、extension ID との混合に注意。

    this._prefix = PREFIX + this._ID;
    this._kokoro = new Kokoro();
    this._connectionState = ConnectionState.NONE;
    this._alreadyAlert = false; // alertがすでに表示されているかのフラグ

    this._clicked = false; // ブロックがクリックされているかのフラグ

    this._intervalId = window.setInterval(this._updateConnectionState, 200, this); // 接続状況を常に確認する interval 関数
  }

  _createClass(IkimonoBlocks, [{
    key: "getInfo",
    value: function getInfo() {
      return {
        id: 'ikimono',
        // scratch-guiから呼び出すときのID いわゆる extensionID
        name: Message.categoryName[this.setLocale()],
        menuIconURI: menuIconURI,
        // base64化したsvgは、このように登録する
        blockIconURI: blockIconURI,
        color1: '#BED537',
        // ブロックのメイン色
        color2: '#A7BC30',
        // ブロックの影の色
        // 以下にobjectを入れていくことで、表示されるブロックを追加していく
        blocks: [{
          opcode: 'connect',
          // コード内にconnect()という関数を作ることでつなげる
          blockType: BlockType.REPORTER,
          // Block の形
          text: Message.connect[this.setLocale()] // Blockの中に表示されるテキスト

        }, '---', {
          opcode: 'spinMotor',
          blockType: BlockType.COMMAND,
          text: Message.spinMotor[this.setLocale()],
          // 中身は、[motor] のモータを [ratio] で回転
          arguments: {
            // text で [] で囲んだものは、opcode に渡す引数になる
            motor: {
              // [motor]
              type: ArgumentType.STRING,
              // String, Number など
              menu: 'motors',
              // blocks の次の要素の menus に書いたメニューを読み込む
              defaultValue: MOTORS.RIGHT
            },
            ratio: {
              // [ratio]
              type: ArgumentType.NUMBER,
              defaultValue: 100
            }
          }
        }, {
          opcode: 'reverseMotor',
          blockType: BlockType.COMMAND,
          text: Message.reverseMotor[this.setLocale()],
          arguments: {
            motor: {
              type: ArgumentType.STRING,
              menu: 'motors',
              defaultValue: MOTORS.RIGHT
            },
            ratio: {
              type: ArgumentType.NUMBER,
              defaultValue: 100
            }
          }
        }, {
          opcode: 'stopMotor',
          blockType: BlockType.COMMAND,
          text: Message.stopMotor[this.setLocale()],
          arguments: {
            motor: {
              type: ArgumentType.STRING,
              menu: 'motors',
              defaultValue: MOTORS.RIGHT
            }
          }
        }, '---', {
          opcode: 'changeLed',
          blockType: BlockType.COMMAND,
          text: Message.changeLed[this.setLocale()],
          arguments: {
            color: {
              type: ArgumentType.STRING,
              menu: 'colors',
              defaultValue: LED_COLOR.RED
            },
            ratio: {
              type: ArgumentType.NUMBER,
              defaultValue: 100
            }
          }
        }, '---', {
          opcode: 'reset',
          blockType: BlockType.REPORTER,
          text: Message.reset[this.setLocale()],
          arguments: {
            reset_type: {
              type: ArgumentType.STRING,
              menu: 'types',
              defaultValue: RESET_TYPE.ALL
            }
          }
        }, {
          opcode: 'setPrefix',
          blockType: BlockType.REPORTER,
          text: Message.setPrefix[this.setLocale()],
          arguments: {
            prefix: {
              type: ArgumentType.STRING,
              defaultValue: "0000"
            }
          }
        }, '---', {
          opcode: 'help',
          blockType: BlockType.REPORTER,
          text: Message.help[this.setLocale()],
          arguments: {
            link: {
              type: ArgumentType.STRING,
              menu: 'links',
              defaultValue: LINK_LIST.GENERAL
            }
          }
        }],
        // block の arguments でドロップダウンリストを表示したいときに設定する
        menus: {
          motors: {
            acceptReporters: true,
            // TODO: what this?
            items: this.MOTOR_MENU // getter として登録したものを参照

          },
          colors: {
            acceptReporters: true,
            items: this.COLOR_MENU
          },
          links: {
            acceptReporters: true,
            items: this.LINKS_MENU
          },
          types: {
            acceptReporters: true,
            items: this.RESET_MENU
          }
        }
      };
    }
  }, {
    key: "_updateConnectionState",

    /**
     * monitor Konashi (timeInterval function)
     * - manage connection state
     * - manage konashi commands
     * 
     * ココロキットでは「接続する」ブロックの左側にあるチェックボックスで接続を管理しています。
     * 
     * ブロックは、Blockyというライブラリで実装されており、
     * Blocklyの関数を使ってチェックボックスの状態を確認しにいっています。
     */
    value: function _updateConnectionState(that) {
      var targetBlock = Blockly.getMainWorkspace().getBlockById('ikimono_connect');

      if (targetBlock) {
        that._clicked = targetBlock.flyoutCheckbox.clicked;
      } // { first action


      if (that._connectionState == ConnectionState.NONE) {
        if (that._clicked) {
          that._kokoro.connect(that._prefix).catch(function (error) {
            log.log(error);
            that._connectionState = ConnectionState.NOT_FOUND; // finish first act
          });

          that._connectionState = ConnectionState.TRY;
        }
      }

      if (that._connectionState == ConnectionState.TRY) {
        if (that._kokoro.isConnected()) {
          that._connectionState = ConnectionState.CONNECTED; // finish first act
        }
      }

      if (that._connectionState == ConnectionState.CONNECTED) {
        // Unchecked connect button. second act
        if (!that._clicked) {
          that._connectionState = ConnectionState.DISCONNECTING; // finish second act
        } // when konashi lost (e.g. power down, took usb cables.)


        if (!that._kokoro.isConnected()) {
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
     * when device lost, it calls.
     * @private
     */

  }, {
    key: "_reset",
    value: function _reset() {
      this._kokoro = new Kokoro();
      this._alreadyAlert = false;
      this._connectionState = ConnectionState.NONE;
    }
  }, {
    key: "setPrefix",
    value: function setPrefix(args) {
      this._ID = args.prefix;
      this._prefix = PREFIX + this._ID;
      return this._ID;
    }
    /**
     * 接続状態に応じて、Reporterの返す値の変更
     * 
     * 実際の接続状態の確認は、this._changeConnectionState()
     */

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
    /**
     * 正回転ブロックの関数
     * 
     * @param {Object} args opcodeから読み込まれる引数たち
     */

  }, {
    key: "spinMotor",
    value: function spinMotor(args) {
      // 接続されていない場合は、なにもしない
      if (!this._kokoro.isConnected()) return; // 入出力を変えるピンセットを初期化

      var pinSet = null; // モータは、どちらを動かすのか選択

      switch (args.motor) {
        case MOTORS.RIGHT:
          pinSet = SPIN_MOTOR.RIGHT;
          break;

        case MOTORS.LEFT:
          pinSet = SPIN_MOTOR.LEFT;
          break;

        default:
          log.log('ERROR unknown motor defined.');
          return;
      } // ピンセットに応じてPWM値の変更


      this._kokoro.setPwmRatio(pinSet.HIGH_PIN, args.ratio);

      this._kokoro.setPwmRatio(pinSet.LOW_PIN, 0);
    }
  }, {
    key: "reverseMotor",
    value: function reverseMotor(args) {
      if (!this._kokoro.isConnected()) return;
      var pinSet = null;

      switch (args.motor) {
        case MOTORS.RIGHT:
          pinSet = REVERSE_MOTOR.RIGHT;
          break;

        case MOTORS.LEFT:
          pinSet = REVERSE_MOTOR.LEFT;
          break;

        default:
          log.log('ERROR unknown motor defined.');
          return;
      }

      this._kokoro.setPwmRatio(pinSet.HIGH_PIN, args.ratio);

      this._kokoro.setPwmRatio(pinSet.LOW_PIN, 0);
    }
  }, {
    key: "stopMotor",
    value: function stopMotor(args) {
      if (!this._kokoro.isConnected()) return;
      var pinA = null;
      var pinB = null;

      switch (args.motor) {
        case MOTORS.RIGHT:
          pinA = 1;
          pinB = 2;
          break;

        case MOTORS.LEFT:
          pinA = 3;
          pinB = 4;
          break;

        default:
          log.log('ERROR unknown motor defined.');
          return;
      }

      this._kokoro.setPwmRatio(pinA, 0);

      this._kokoro.setPwmRatio(pinB, 0);
    }
  }, {
    key: "changeLed",
    value: function changeLed(args) {
      if (!this._kokoro.isConnected()) return;

      switch (args.color) {
        case LED_COLOR.RED:
          this._kokoro.setPwmRatio(5, args.ratio);

          break;

        case LED_COLOR.GREEN:
          this._kokoro.setPwmRatio(6, args.ratio);

          break;

        case LED_COLOR.BLUE:
          this._kokoro.setPwmRatio(7, args.ratio);

          break;

        default:
          log.log('ERROR unknown LED defined.');
          break;
      }
    }
  }, {
    key: "reset",
    value: function reset(args) {
      if (!this._kokoro.isConnected()) return;

      this._kokoro.reset(args.reset_type);
    }
  }, {
    key: "help",
    value: function help(args) {
      var target_url = "";

      switch (args.link) {
        case LINK_LIST.GENERAL:
          target_url = url_general_help;
          break;

        case LINK_LIST.CONNECT:
          target_url = url_connect_help;
          break;

        case LINK_LIST.LOST:
          target_url = url_reconnect_help;
          break;

        case LINK_LIST.BLOCKS:
          target_url = url_blocks_help;
          break;

        default:
          target_url = url_general_help;
      }

      window.open(target_url);
    }
  }, {
    key: "debug",
    value: function debug() {
      if (!this._kokoro.isConnected()) return;

      this._kokoro.setPwmRatio(2, 100);
    } // 現在のページのロケールを取得し、Messageに渡す。
    // 用意している言語以外は、英語で表示されるように。

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
    key: "MOTOR_MENU",
    get: function get() {
      return [{
        text: Message.motor_right[this.setLocale()],
        value: MOTORS.RIGHT
      }, {
        text: Message.motor_left[this.setLocale()],
        value: MOTORS.LEFT
      }];
    }
  }, {
    key: "COLOR_MENU",
    get: function get() {
      return [{
        text: Message.color.red[this.setLocale()],
        value: LED_COLOR.RED
      }, {
        text: Message.color.green[this.setLocale()],
        value: LED_COLOR.GREEN
      }, {
        text: Message.color.blue[this.setLocale()],
        value: LED_COLOR.BLUE
      }];
    }
  }, {
    key: "LINKS_MENU",
    get: function get() {
      return [{
        text: Message.help_links.general[this.setLocale()],
        value: LINK_LIST.GENERAL
      }, {
        text: Message.help_links.connect[this.setLocale()],
        value: LINK_LIST.CONNECT
      }, {
        text: Message.help_links.lost[this.setLocale()],
        value: LINK_LIST.LOST
      }, {
        text: Message.help_links.blocks[this.setLocale()],
        value: LINK_LIST.BLOCKS
      }];
    }
  }, {
    key: "RESET_MENU",
    get: function get() {
      return [{
        text: Message.reset_type.all[this.setLocale()],
        value: RESET_TYPE.ALL
      }, {
        text: Message.reset_type.motor[this.setLocale()],
        value: RESET_TYPE.MOTOR
      }, {
        text: Message.reset_type.led[this.setLocale()],
        value: RESET_TYPE.LED
      }];
    }
  }]);

  return IkimonoBlocks;
}();

module.exports = IkimonoBlocks;
