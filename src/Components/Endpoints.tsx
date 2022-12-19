
const getHostname = () => {
    let net = window.location;
    return `${net.protocol}//${net.hostname}:8080`;
}

export const rankingSearch = (keywords: string) => `${getHostname()}/ranking/search/${keywords}`;
export const ticketIsValidCheck = (code: string, rankingId: number) => `${getHostname()}/ticket/isValid?key=${code}&rankingId=${rankingId}`;