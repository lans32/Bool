export const isHomePage = (path:string) => {
	return path == "/"
}

export const isActivityPage = (path:string) => {
    return path.match(/^\/operations\/(\d+)/)
}

export const truncate = (source:string, size=100) => {
    return source.length > size ? source.slice(0, size - 1) + "…" : source;
}