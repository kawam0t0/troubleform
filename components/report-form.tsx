"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { FormData } from "@/app/page"

const STORES = ["前橋50号店", "伊勢崎韮塚店", "高崎棟高店", "足利緑町店", "新前橋店", "太田新田店"]

const HANDLERS = ["大野", "霜田", "三富", "ラメザニ"]

const CATEGORIES = ["洗車機エラー系", "洗車機傷系", "お客様トラブル系", "その他"] as const

const ERROR_MESSAGES = ["オーバーロード", "アブノーマル", "エラー文言無し", "その他"]

const ERROR_DAMAGED_PARTS = [
  "ハイプレッシャー",
  "リアプレッシャー",
  "ホイールブラシ",
  "ホイールブラシチェーン",
  "ショートスカートブラシ",
  "トップブラシ",
  "ミドルブラシ",
  "ライトサイドブラシ",
  "レフトサイドブラシ",
  "昇降ブロワー",
  "ブロワー",
  "コンベアー",
  "シリンダー",
  "その他",
]

const DAMAGE_TYPES = ["アンテナ損傷", "ホイール損傷", "ボディー損傷", "サイドミラー破損", "シミ", "その他"]

type ReportFormProps = {
  initialData: FormData
  onSubmit: (data: FormData) => void
}

export function ReportForm({ initialData, onSubmit }: ReportFormProps) {
  const [formData, setFormData] = useState<FormData>(initialData)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const isFormValid = () => {
    if (!formData.date || !formData.storeName || !formData.staffName || !formData.category) {
      return false
    }

    if (formData.category === "洗車機エラー系") {
      const hasErrorMessage =
        formData.errorMessage && (formData.errorMessage !== "その他" || formData.errorMessageDetail)
      const hasDamagedPart = formData.damagedPart && (formData.damagedPart !== "その他" || formData.damagedPartDetail)
      return !!(hasErrorMessage && hasDamagedPart)
    }

    if (formData.category === "洗車機傷系") {
      const hasDamageType = formData.damageType && (formData.damageType !== "その他" || formData.damageTypeDetail)
      return !!(hasDamageType && formData.details)
    }

    if (formData.category === "お客様トラブル系" || formData.category === "その他") {
      return !!formData.freeText
    }

    return false
  }

  return (
    <div className="container mx-auto max-w-2xl p-4 pb-20">
      <Card className="border-2">
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-2xl font-bold text-balance">洗車機トラブル報告</CardTitle>
          <CardDescription className="text-base">発生したトラブルの詳細を入力してください</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 日付 */}
            <div className="space-y-3">
              <Label htmlFor="date" className="text-base font-semibold">
                日付 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="h-12 text-base"
              />
            </div>

            {/* 店舗名 */}
            <div className="space-y-3">
              <Label htmlFor="store" className="text-base font-semibold">
                発生した店舗名 <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.storeName}
                onValueChange={(value) => setFormData({ ...formData, storeName: value })}
              >
                <SelectTrigger id="store" className="h-12 text-base">
                  <SelectValue placeholder="店舗を選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {STORES.map((store) => (
                    <SelectItem key={store} value={store} className="text-base py-3">
                      {store}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 対応者 */}
            <div className="space-y-3">
              <Label htmlFor="handler" className="text-base font-semibold">
                対応者 <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.staffName}
                onValueChange={(value) => setFormData({ ...formData, staffName: value })}
              >
                <SelectTrigger id="handler" className="h-12 text-base">
                  <SelectValue placeholder="対応者を選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {HANDLERS.map((handler) => (
                    <SelectItem key={handler} value={handler} className="text-base py-3">
                      {handler}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 問い合わせカテゴリー */}
            <div className="space-y-3">
              <Label htmlFor="category" className="text-base font-semibold">
                問い合わせカテゴリー <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    category: value as FormData["category"],
                    // Reset category-specific fields
                    errorMessage: undefined,
                    errorMessageDetail: undefined,
                    damagedPart: undefined,
                    damagedPartDetail: undefined,
                    wiringError: undefined,
                    damageType: undefined,
                    damageTypeDetail: undefined,
                    details: undefined,
                    freeText: undefined,
                    side: undefined,
                  })
                }
              >
                <SelectTrigger id="category" className="h-12 text-base">
                  <SelectValue placeholder="カテゴリーを選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category} className="text-base py-3">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 洗車機エラー系の入力項目 */}
            {formData.category === "洗車機エラー系" && (
              <div className="space-y-6 pt-4 border-t-2">
                <h3 className="font-semibold text-lg">問い合わせ内容</h3>

                <div className="space-y-3">
                  <Label htmlFor="errorMessage" className="text-base font-semibold">
                    エラー文言 <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.errorMessage || ""}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        errorMessage: value,
                        errorMessageDetail: value !== "その他" ? "" : formData.errorMessageDetail,
                      })
                    }
                  >
                    <SelectTrigger id="errorMessage" className="h-12 text-base">
                      <SelectValue placeholder="エラー文言を選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      {ERROR_MESSAGES.map((message) => (
                        <SelectItem key={message} value={message} className="text-base py-3">
                          {message}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.errorMessage === "その他" && (
                  <div className="space-y-3">
                    <Label htmlFor="errorMessageDetail" className="text-base font-semibold">
                      エラー文言の詳細 <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="errorMessageDetail"
                      type="text"
                      placeholder="詳細を入力してください"
                      value={formData.errorMessageDetail || ""}
                      onChange={(e) => setFormData({ ...formData, errorMessageDetail: e.target.value })}
                      className="h-12 text-base"
                    />
                  </div>
                )}

                {/* 損傷箇所 */}
                <div className="space-y-3">
                  <Label htmlFor="damagedPart" className="text-base font-semibold">
                    損傷箇所 <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.damagedPart || ""}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        damagedPart: value,
                        damagedPartDetail: value !== "その他" ? "" : formData.damagedPartDetail,
                      })
                    }
                  >
                    <SelectTrigger id="damagedPart" className="h-12 text-base">
                      <SelectValue placeholder="損傷箇所を選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      {ERROR_DAMAGED_PARTS.map((part) => (
                        <SelectItem key={part} value={part} className="text-base py-3">
                          {part}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.damagedPart === "その他" && (
                  <div className="space-y-3">
                    <Label htmlFor="damagedPartDetail" className="text-base font-semibold">
                      損傷箇所の詳細 <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="damagedPartDetail"
                      type="text"
                      placeholder="詳細を入力してください"
                      value={formData.damagedPartDetail || ""}
                      onChange={(e) => setFormData({ ...formData, damagedPartDetail: e.target.value })}
                      className="h-12 text-base"
                    />
                  </div>
                )}

                {/* 位置 */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">位置</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={formData.side === "助手席側" ? "default" : "outline"}
                      className="h-14 text-base font-semibold"
                      onClick={() => setFormData({ ...formData, side: "助手席側" })}
                    >
                      助手席側
                    </Button>
                    <Button
                      type="button"
                      variant={formData.side === "運転席側" ? "default" : "outline"}
                      className="h-14 text-base font-semibold"
                      onClick={() => setFormData({ ...formData, side: "運転席側" })}
                    >
                      運転席側
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="wiringError" className="text-base font-semibold">
                    配線のエラー文言 <span className="text-muted-foreground text-sm font-normal">例) X〇〇</span>
                  </Label>
                  <Input
                    id="wiringError"
                    type="text"
                    placeholder="配線のエラー文言を入力してください"
                    value={formData.wiringError || ""}
                    onChange={(e) => setFormData({ ...formData, wiringError: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>

                {/* その他備考 */}
                <div className="space-y-3">
                  <Label htmlFor="remarks" className="text-base font-semibold">
                    その他備考
                  </Label>
                  <Textarea
                    id="remarks"
                    placeholder="その他備考を入力してください"
                    value={formData.remarks || ""}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    className="min-h-32 text-base resize-none"
                  />
                </div>
              </div>
            )}

            {/* 洗車機傷系の入力項目 */}
            {formData.category === "洗車機傷系" && (
              <div className="space-y-6 pt-4 border-t-2">
                <h3 className="font-semibold text-lg">問い合わせ内容</h3>

                {/* 損傷箇所 */}
                <div className="space-y-3">
                  <Label htmlFor="damageType" className="text-base font-semibold">
                    損傷箇所 <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.damageType || ""}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        damageType: value,
                        damageTypeDetail: value !== "その他" ? "" : formData.damageTypeDetail,
                      })
                    }
                  >
                    <SelectTrigger id="damageType" className="h-12 text-base">
                      <SelectValue placeholder="損傷箇所を選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAMAGE_TYPES.map((type) => (
                        <SelectItem key={type} value={type} className="text-base py-3">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.damageType === "その他" && (
                  <div className="space-y-3">
                    <Label htmlFor="damageTypeDetail" className="text-base font-semibold">
                      損傷箇所の詳細 <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="damageTypeDetail"
                      type="text"
                      placeholder="詳細を入力してください"
                      value={formData.damageTypeDetail || ""}
                      onChange={(e) => setFormData({ ...formData, damageTypeDetail: e.target.value })}
                      className="h-12 text-base"
                    />
                  </div>
                )}

                {/* 位置 */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">位置</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={formData.side === "助手席側" ? "default" : "outline"}
                      className="h-14 text-base font-semibold"
                      onClick={() => setFormData({ ...formData, side: "助手席側" })}
                    >
                      助手席側
                    </Button>
                    <Button
                      type="button"
                      variant={formData.side === "運転席側" ? "default" : "outline"}
                      className="h-14 text-base font-semibold"
                      onClick={() => setFormData({ ...formData, side: "運転席側" })}
                    >
                      運転席側
                    </Button>
                  </div>
                </div>

                {/* 詳細 */}
                <div className="space-y-3">
                  <Label htmlFor="details" className="text-base font-semibold">
                    詳細 <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="details"
                    placeholder="詳細を入力してください"
                    value={formData.details || ""}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    className="min-h-32 text-base resize-none"
                  />
                </div>

                {/* その他備考 */}
                <div className="space-y-3">
                  <Label htmlFor="remarks" className="text-base font-semibold">
                    その他備考
                  </Label>
                  <Textarea
                    id="remarks"
                    placeholder="その他備考を入力してください"
                    value={formData.remarks || ""}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    className="min-h-32 text-base resize-none"
                  />
                </div>
              </div>
            )}

            {/* お客様トラブル系/その他の入力項目 */}
            {(formData.category === "お客様トラブル系" || formData.category === "その他") && (
              <div className="space-y-6 pt-4 border-t-2">
                <h3 className="font-semibold text-lg">問い合わせ内容</h3>

                <div className="space-y-3">
                  <Label htmlFor="freeText" className="text-base font-semibold">
                    詳細 <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="freeText"
                    placeholder="詳細を入力してください"
                    value={formData.freeText || ""}
                    onChange={(e) => setFormData({ ...formData, freeText: e.target.value })}
                    className="min-h-40 text-base resize-none"
                  />
                </div>

                {/* その他備考 */}
                <div className="space-y-3">
                  <Label htmlFor="remarks" className="text-base font-semibold">
                    その他備考
                  </Label>
                  <Textarea
                    id="remarks"
                    placeholder="その他備考を入力してください"
                    value={formData.remarks || ""}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    className="min-h-32 text-base resize-none"
                  />
                </div>
              </div>
            )}

            {/* 確認ボタン */}
            <Button type="submit" disabled={!isFormValid()} className="w-full h-14 text-lg font-semibold">
              確認する
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
