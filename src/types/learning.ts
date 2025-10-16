export interface LearningModule {
    id: string
    title: string
    slug: string
    content: string
    order: number
}

export interface LearningCategory {
    id: string
    title: string
    slug: string
    description: string
    image: string
    modules: LearningModule[]
}