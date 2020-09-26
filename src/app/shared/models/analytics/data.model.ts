import { Series } from "./series.model"

export interface Data {
    title?: string
    type: string
    tooltip: string
    metric: string
    value: any,
    series?: Series
    name?: string
}