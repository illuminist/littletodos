#!/bin/node
const fs = require('fs')
const { exec } = require('child_process')

const manifestJsonPath = '../public/manifest.json'
const outputDir = '../public'
const inputFile = './LittleTodo.svg'

const size = [72, 96, 120, 128, 144, 152, 180, 192, 384, 512]

size.forEach((s) => {
  exec(
    `inkscape --export-png ${outputDir}/logo-${s}.png -w ${s} -h ${s} ${inputFile}`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`)
        return
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`)
        return
      }
      console.log(`stdout: ${stdout}`)
    },
  )
})

exec(`convert -background none ${inputFile} ${outputDir}/favicon.ico`)

const manifestJson = fs.readFileSync(manifestJsonPath)
const manifest = JSON.parse(manifestJson)
manifest.icons = [
  ...size.map((s) => {
    return { src: `/logo-${s}.png`, type: 'image/png', sizes: `${s}x${s}` }
  }),
  { src: '/favicon.ico', type: 'image/ico', sizes: `${60}x${60}` },
]
fs.writeFileSync(manifestJsonPath, JSON.stringify(manifest, null, 2))
