import { Metadata } from 'next'
import { GuessGameMain } from '@/components/guess-game/guess-game-main'
import { FeaturePageLayout } from '@/components/feature-page-layout'
import { GameControllerIcon } from '@/components/icon'

export const metadata: Metadata = {
  title: 'Tebak Gambar - Gerbang Logika',
  description: 'Game tebak gambar aplikasi gerbang logika dalam kehidupan sehari-hari',
}

export default function GuessGamePage() {
  return (
    <>
      <div>
        <FeaturePageLayout title="Tebak Gambar" icon={<GameControllerIcon />} bgColor="bg-magenta-card" backHref="/game">
          <GuessGameMain />
        </FeaturePageLayout>
      </div>
    </>
  )
}
