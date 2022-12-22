
const getHostname = () => {
    let net = window.location;
    return `${net.protocol}//${net.hostname}:8080`;
}

// ranking
export const rankingSearch = (keywords: string) => `${getHostname()}/ranking/search/${keywords}`;

// teacher
export const getTeacherByRanking = (rankingId: number) => `${getHostname()}/teacher/get/allFromRanking/${rankingId}`

// ticket
export const ticketIsValidCheck = (code: string, rankingId: number) => `${getHostname()}/ticket/isValid?key=${code}&rankingId=${rankingId}`;
export const ticketSubmit = (code: string, rankingId: number) => `${getHostname()}/ticket/use?code=${code}&rankingId=${rankingId}`;

// question
export const getQuestions = (rankingId: number) => `${getHostname()}/question/get/allFromRanking/${rankingId}`;