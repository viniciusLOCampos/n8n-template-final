import React, { useState } from 'react'
import { generateHash } from '../utils/hash'
import { generateN8NTemplate } from '../utils/n8nTemplate'

interface FormData {
  projectName: string
  domainName: string
  n8nWebhookDomain: string
  redisPassword: string
  postgresPassword: string
  encryptionKey: string
}

export default function ConfigForm() {
  const [formData, setFormData] = useState<FormData>({
    projectName: '',
    domainName: '',
    n8nWebhookDomain: '',
    redisPassword: '',
    postgresPassword: '',
    encryptionKey: ''
  })
  const [generatedCode, setGeneratedCode] = useState('')
  const [copyStatus, setCopyStatus] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleGenerate = async (field: keyof FormData) => {
    const hash = await generateHash()
    setFormData(prev => ({ ...prev, [field]: hash }))
  }

  const generateDBCode = () => {
    const template = {
      services: [
        {
          type: "postgres",
          data: {
            projectName: formData.projectName,
            serviceName: "n8n_postgres",
            image: "postgres:16",
            password: formData.postgresPassword
          }
        },
        {
          type: "redis",
          data: {
            projectName: formData.projectName,
            serviceName: "redis_n8n",
            image: "redis:7",
            password: formData.redisPassword
          }
        }
      ]
    }
    setGeneratedCode(JSON.stringify(template, null, 2))
  }

  const generateN8NCode = () => {
    const template = generateN8NTemplate(formData)
    setGeneratedCode(JSON.stringify(template, null, 2))
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode)
      setCopyStatus('Copiado!')
      setTimeout(() => setCopyStatus(''), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      try {
        const textarea = document.createElement('textarea')
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        textarea.value = generatedCode
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        setCopyStatus('Copiado!')
        setTimeout(() => setCopyStatus(''), 2000)
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr)
        setCopyStatus('Erro ao copiar')
        setTimeout(() => setCopyStatus(''), 2000)
      }
    }
  }

  const inputBaseClass = "h-12 mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3"
  const labelClass = "block text-sm font-medium text-gray-200"
  const buttonClass = "h-12 flex items-center justify-center px-4 border border-gray-600 bg-gray-800 text-gray-200 text-sm hover:bg-gray-700"

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div>
          <label htmlFor="projectName" className={labelClass}>
            Project Name
          </label>
          <input
            type="text"
            id="projectName"
            name="projectName"
            value={formData.projectName}
            onChange={handleInputChange}
            className={inputBaseClass}
            required
          />
        </div>

        <div>
          <label htmlFor="domainName" className={labelClass}>
            Domain Name
          </label>
          <input
            type="text"
            id="domainName"
            name="domainName"
            value={formData.domainName}
            onChange={handleInputChange}
            className={inputBaseClass}
            required
          />
        </div>

        <div>
          <label htmlFor="n8nWebhookDomain" className={labelClass}>
            N8N Webhook Domain
          </label>
          <input
            type="text"
            id="n8nWebhookDomain"
            name="n8nWebhookDomain"
            value={formData.n8nWebhookDomain}
            onChange={handleInputChange}
            className={inputBaseClass}
            required
          />
        </div>

        <div>
          <label htmlFor="redisPassword" className={labelClass}>
            Redis Password
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              id="redisPassword"
              name="redisPassword"
              value={formData.redisPassword}
              onChange={handleInputChange}
              className={`${inputBaseClass} !mt-0 rounded-r-none`}
              required
            />
            <button
              type="button"
              onClick={() => handleGenerate('redisPassword')}
              className={`${buttonClass} rounded-l-none border-l-0 w-32`}
            >
              Generate
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="postgresPassword" className={labelClass}>
            PostgreSQL Password
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              id="postgresPassword"
              name="postgresPassword"
              value={formData.postgresPassword}
              onChange={handleInputChange}
              className={`${inputBaseClass} !mt-0 rounded-r-none`}
              required
            />
            <button
              type="button"
              onClick={() => handleGenerate('postgresPassword')}
              className={`${buttonClass} rounded-l-none border-l-0 w-32`}
            >
              Generate
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="encryptionKey" className={labelClass}>
            Encryption Key
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              id="encryptionKey"
              name="encryptionKey"
              value={formData.encryptionKey}
              onChange={handleInputChange}
              className={`${inputBaseClass} !mt-0 rounded-r-none`}
              required
            />
            <button
              type="button"
              onClick={() => handleGenerate('encryptionKey')}
              className={`${buttonClass} rounded-l-none border-l-0 w-32`}
            >
              Generate
            </button>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={generateDBCode}
          className="flex-1 h-12 flex justify-center items-center rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Gerar Codigo BD
        </button>
        <button
          type="button"
          onClick={generateN8NCode}
          className="flex-1 h-12 flex justify-center items-center rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Gerar Codigo N8N
        </button>
      </div>

      {generatedCode && (
        <div className="mt-6">
          <div className="relative">
            <pre className="bg-gray-900 rounded-md p-4 overflow-x-auto text-sm text-white">
              {generatedCode}
            </pre>
            <button
              onClick={copyToClipboard}
              className="absolute top-2 right-2 px-3 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-700 text-sm"
            >
              {copyStatus || 'Copiar código'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
