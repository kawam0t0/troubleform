"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

type SuccessScreenProps = {
  onReset: () => void
}

export function SuccessScreen({ onReset }: SuccessScreenProps) {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 md:py-12">
      <div className="flex items-center justify-center min-h-[70vh]">
        <Card className="w-full">
          <CardContent className="pt-12 pb-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-6">
              <CheckCircle className="w-12 h-12 text-accent" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-balance mb-4">送信完了</h1>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Trelloカードが正常に作成されました
              <br />
              ご報告ありがとうございます
            </p>
            <Button size="lg" className="h-14 text-base font-semibold px-8" onClick={onReset}>
              新しい報告を作成
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
