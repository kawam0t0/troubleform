"use client"

import { useState } from "react"
import { ReportForm } from "@/components/report-form"
import { ConfirmationScreen } from "@/components/confirmation-screen"
import { SuccessScreen } from "@/components/success-screen"

export type FormData = {
  date: string
  storeName: string
  staffName: string
  category: "洗車機エラー系" | "洗車機傷系" | "お客様トラブル系" | "その他" | ""
  // 洗車機エラー系
  errorMessage?: string
  errorMessageDetail?: string
  damagedPart?: string
  damagedPartDetail?: string
  side?: "助手席側" | "運転席側" | ""
  wiringError?: string
  remarks?: string
  // 洗車機傷系
  damageType?: string
  damageTypeDetail?: string
  details?: string
  // お客様トラブル系/その他
  freeText?: string
}

function getTodayDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export default function Home() {
  const [step, setStep] = useState<"form" | "confirm" | "success">("form")
  const [formData, setFormData] = useState<FormData>({
    date: getTodayDate(),
    storeName: "",
    staffName: "",
    category: "",
  })

  const handleFormSubmit = (data: FormData) => {
    setFormData(data)
    setStep("confirm")
  }

  const handleConfirm = async () => {
    setStep("success")
  }

  const handleEdit = () => {
    setStep("form")
  }

  const handleReset = () => {
    setFormData({
      date: getTodayDate(),
      storeName: "",
      staffName: "",
      category: "",
    })
    setStep("form")
  }

  return (
    <main className="min-h-screen bg-background">
      {step === "form" && <ReportForm initialData={formData} onSubmit={handleFormSubmit} />}
      {step === "confirm" && <ConfirmationScreen data={formData} onConfirm={handleConfirm} onEdit={handleEdit} />}
      {step === "success" && <SuccessScreen onReset={handleReset} />}
    </main>
  )
}
