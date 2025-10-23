"use server"

import type { FormData } from "./page"

export async function createTrelloCard(data: FormData) {
  const apiKey = process.env.TRELLO_API_KEY?.trim()
  const token = process.env.TRELLO_TOKEN?.trim()
  const listId = process.env.TRELLO_LIST_ID?.trim()

  console.log("[v0] Environment variables check:")
  console.log("[v0] API Key exists:", !!apiKey)
  console.log("[v0] API Key length:", apiKey?.length)
  console.log("[v0] API Key starts with:", apiKey?.substring(0, 8))
  console.log("[v0] Token exists:", !!token)
  console.log("[v0] Token length:", token?.length)
  console.log("[v0] Token starts with:", token?.substring(0, 8))
  console.log("[v0] List ID:", listId)

  if (!apiKey || !token || !listId) {
    throw new Error("Trello API credentials are not configured")
  }

  let cardTitle = ""
  if (data.category === "洗車機エラー系") {
    const errorMsg =
      data.errorMessage === "その他" && data.errorMessageDetail
        ? `その他: ${data.errorMessageDetail}`
        : data.errorMessage
    cardTitle = `${errorMsg} - ${data.storeName}`
  } else if (data.category === "洗車機傷系") {
    const damageType =
      data.damageType === "その他" && data.damageTypeDetail ? `その他: ${data.damageTypeDetail}` : data.damageType
    cardTitle = `${damageType} - ${data.storeName}`
  } else if (data.category === "お客様トラブル系") {
    cardTitle = `お客様トラブル系 - ${data.storeName}`
  } else if (data.category === "その他") {
    cardTitle = `その他 - ${data.storeName}`
  }

  let description = `## 日付\n${data.date}\n\n## 店舗名\n${data.storeName}\n\n## 担当者名\n${data.staffName}\n\n## 問い合わせカテゴリー\n${data.category}\n\n`

  if (data.category === "洗車機エラー系") {
    const errorMsg =
      data.errorMessage === "その他" && data.errorMessageDetail
        ? `その他: ${data.errorMessageDetail}`
        : data.errorMessage
    const damagedPart =
      data.damagedPart === "その他" && data.damagedPartDetail ? `その他: ${data.damagedPartDetail}` : data.damagedPart
    description += `## エラー文言\n${errorMsg}\n\n## 損傷箇所\n${damagedPart}\n\n## 位置\n${data.side}\n\n## 配線のエラー文言\n${data.wiringError}`
    if (data.remarks) {
      description += `\n\n## その他備考\n${data.remarks}`
    }
  } else if (data.category === "洗車機傷系") {
    const damageType =
      data.damageType === "その他" && data.damageTypeDetail ? `その他: ${data.damageTypeDetail}` : data.damageType
    description += `## 損傷箇所\n${damageType}\n\n## 位置\n${data.side}\n\n## 詳細\n${data.details}`
    if (data.remarks) {
      description += `\n\n## その他備考\n${data.remarks}`
    }
  } else if (data.category === "お客様トラブル系" || data.category === "その他") {
    description += `## 詳細\n${data.freeText}`
    if (data.remarks) {
      description += `\n\n## その他備考\n${data.remarks}`
    }
  }

  const url = `https://api.trello.com/1/cards?key=${apiKey}&token=${token}`
  console.log("[v0] Request URL (key/token masked):", url.replace(apiKey, "***KEY***").replace(token, "***TOKEN***"))
  console.log(
    "[v0] Request body:",
    JSON.stringify({
      idList: listId,
      name: cardTitle,
      desc: description.trim(),
    }),
  )

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idList: listId,
      name: cardTitle,
      desc: description.trim(),
    }),
  })

  console.log("[v0] Response status:", response.status)

  if (!response.ok) {
    const error = await response.text()
    console.log("[v0] Error response:", error)
    throw new Error(`Failed to create Trello card: ${error}`)
  }

  return await response.json()
}
