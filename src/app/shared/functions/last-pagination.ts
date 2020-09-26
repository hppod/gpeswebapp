export function checkUrlAndSetFirstPage(currentUrl: string) {
    if (sessionStorage.getItem('lastUrl') != currentUrl) {
        setLastPage(1)
    }
}

export function setLastPage(page: number) {
    sessionStorage.setItem('lastPage', page.toString())
}

export function getLastPage(): string {
    return sessionStorage.getItem('lastPage')
}

export function setLastUrl(url: string) {
    sessionStorage.setItem('lastUrl', url)
}

export function getLastUrl(): string {
    return sessionStorage.getItem('lastUrl')
}