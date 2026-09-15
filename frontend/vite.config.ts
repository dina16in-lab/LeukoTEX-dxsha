import fs from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

function getEnvValue(key: string): string {
  if (process.env[key]) return process.env[key]!
  const envPaths = [
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '../backend/.env'),
  ]
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8')
      const match = content.match(new RegExp(`^${key}=["']?([^"'\r\n]+)["']?`, 'm'))
      if (match) return match[1].trim()
    }
  }
  return ''
}

function localContactApiPlugin(): Plugin {
  return {
    name: 'local-contact-api',
    configureServer(server) {
      server.middlewares.use('/api/contact', (req, res, next) => {
        if (req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}')
              const resendApiKey = getEnvValue('RESEND_API_KEY')
              const emailFrom = getEnvValue('EMAIL_FROM') || 'LEUKOTEX Inquiries <onboarding@resend.dev>'
              const emailTo = getEnvValue('EMAIL_TO') || 'dina16in@gmail.com'

              if (!resendApiKey) {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                return res.end(JSON.stringify({ detail: 'RESEND_API_KEY not found in environment.' }))
              }

              const subject = `New LEUKOTEX Project Inquiry — ${data.projectType || 'General Scope'}`
              const textContent = `LEUKOTEX — New Project Inquiry\n\nName: ${data.name}\nEmail: ${data.email}\nScope: ${data.projectType}\nBudget: ${data.budget}\nDescription:\n${data.description}`

              const resendRes = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${resendApiKey}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  from: emailFrom,
                  to: [emailTo],
                  reply_to: data.email,
                  subject,
                  text: textContent,
                }),
              })

              if (!resendRes.ok) {
                const errText = await resendRes.text()
                res.statusCode = 502
                res.setHeader('Content-Type', 'application/json')
                return res.end(JSON.stringify({ detail: 'Failed to deliver email: ' + errText }))
              }

              const result = (await resendRes.json()) as { id: string }
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              return res.end(
                JSON.stringify({
                  success: true,
                  message: 'Your inquiry has been received. Our studio will connect with you within 24 hours.',
                  inquiry_id: result.id,
                })
              )
            } catch (err: any) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              return res.end(JSON.stringify({ detail: err?.message || 'Internal error' }))
            }
          })
        } else {
          next()
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localContactApiPlugin()],
  server: {
    // Proxy other API requests to backend during development
    proxy: {
      '/api/projects': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/api/services': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
