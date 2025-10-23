"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Edit, Loader2 } from "lucide-react"
import { createTrelloCard } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import type { FormData } from "@/app/page"

type ConfirmationScreenProps = {
  data: FormData
  onConfirm: () => void
  onEdit: () => void
}

export function ConfirmationScreen({ data, onConfirm, onEdit }: ConfirmationScreenProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleConfirm = async () => {
    setIsSubmitting(true)
    try {
      await createTrelloCard(data)
      onConfirm()
    } catch (error) {
      toast({
        title: "エラー",
        description: "カードの作成に失敗しました。もう一度お試しください。",
        variant: "destructive",
      })
      console.error("Failed to create Trello card:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 md:py-12">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
          <CheckCircle2 className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-balance mb-2">内容確認</h1>
        <p className="text-muted-foreground text-lg">以下の内容で送信します</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>報告内容</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">日付</h3>
            <p className="text-base leading-relaxed bg-muted p-4 rounded-lg">{data.date}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">店舗名</h3>
            <p className="text-base leading-relaxed bg-muted p-4 rounded-lg">{data.storeName}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">対応者</h3>
            <p className="text-base leading-relaxed bg-muted p-4 rounded-lg">{data.staffName}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">問い合わせカテゴリー</h3>
            <p className="text-base leading-relaxed bg-muted p-4 rounded-lg">{data.category}</p>
          </div>

          {data.category === "洗車機エラー系" && (
            <>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">エラー文言</h3>
                <p className="text-base leading-relaxed bg-muted p-4 rounded-lg">
                  {data.errorMessage === "その他" && data.errorMessageDetail
                    ? `その他: ${data.errorMessageDetail}`
                    : data.errorMessage}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">損傷箇所</h3>
                <p className="text-base leading-relaxed bg-muted p-4 rounded-lg">
                  {data.damagedPart === "その他" && data.damagedPartDetail
                    ? `その他: ${data.damagedPartDetail}`
                    : data.damagedPart}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">位置</h3>
                <p className="text-base leading-relaxed bg-muted p-4 rounded-lg">{data.side}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">配線のエラー文言</h3>
                <p className="text-base leading-relaxed bg-muted p-4 rounded-lg">{data.wiringError}</p>
              </div>

              {data.remarks && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">その他備考</h3>
                  <p className="text-base leading-relaxed bg-muted p-4 rounded-lg whitespace-pre-wrap">
                    {data.remarks}
                  </p>
                </div>
              )}
            </>
          )}

          {data.category === "洗車機傷系" && (
            <>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">損傷箇所</h3>
                <p className="text-base leading-relaxed bg-muted p-4 rounded-lg">
                  {data.damageType === "その他" && data.damageTypeDetail
                    ? `その他: ${data.damageTypeDetail}`
                    : data.damageType}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">位置</h3>
                <p className="text-base leading-relaxed bg-muted p-4 rounded-lg">{data.side}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">詳細</h3>
                <p className="text-base leading-relaxed bg-muted p-4 rounded-lg whitespace-pre-wrap">{data.details}</p>
              </div>

              {data.remarks && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">その他備考</h3>
                  <p className="text-base leading-relaxed bg-muted p-4 rounded-lg whitespace-pre-wrap">
                    {data.remarks}
                  </p>
                </div>
              )}
            </>
          )}

          {(data.category === "お客様トラブル系" || data.category === "その他") && (
            <>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">詳細</h3>
                <p className="text-base leading-relaxed bg-muted p-4 rounded-lg whitespace-pre-wrap">{data.freeText}</p>
              </div>

              {data.remarks && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">その他備考</h3>
                  <p className="text-base leading-relaxed bg-muted p-4 rounded-lg whitespace-pre-wrap">
                    {data.remarks}
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          size="lg"
          className="h-14 text-base font-semibold bg-transparent"
          onClick={onEdit}
          disabled={isSubmitting}
        >
          <Edit className="w-5 h-5 mr-2" />
          修正する
        </Button>
        <Button size="lg" className="h-14 text-base font-semibold" onClick={handleConfirm} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              送信中...
            </>
          ) : (
            "送信する"
          )}
        </Button>
      </div>
    </div>
  )
}
