
const getHostname = () => {
    let net = window.location;
    return `${net.protocol}//ranking.ddns.net/api`;
    // return `${net.protocol}//localhost:8080`
}

// ranking
export const rankingSearch = (keywords: string) => `${getHostname()}/ranking/search/${keywords}`;
export const getAllMyRankings = () => `${getHostname()}/ranking/get/allMine`;

// teacher
export const getTeacherByRanking = (rankingId: number) => `${getHostname()}/teacher/get/allFromRanking/${rankingId}`
export const update_teacher = (teacher_id: number) => `${getHostname()}/teacher/update/${teacher_id}`
export const delete_teacher = (teacher_id: number) => `${getHostname()}/teacher/delete/${teacher_id}`
export const create_teacher = () => `${getHostname()}/teacher/create`

// ticket
export const getTickets = (rankingId: number) => `${getHostname()}/ticket/get/allFromRanking/${rankingId}`
export const ticketIsValidCheck = (code: string, rankingId: number) => `${getHostname()}/ticket/isValid?key=${code}&rankingId=${rankingId}`;
export const ticketSubmit = (code: string, rankingId: number) => `${getHostname()}/ticket/use?code=${code}&rankingId=${rankingId}`;
export const create_tickets = (rankingId: number, n: number) => `${getHostname()}/ticket/create?rankingId=${rankingId}&n=${n}`

// question
export const getQuestions = (rankingId: number) => `${getHostname()}/question/get/allFromRanking/${rankingId}`;
export const updateQuestion = (questionId: number) => `${getHostname()}/question/update/${questionId}`
export const deleteQuestion = (questionId: number) => `${getHostname()}/question/delete/${questionId}`
export const create_question = () => `${getHostname()}/question/create`
export const get_results = (questionId: number) => `${getHostname()}/question/rank/${questionId}`

// user
export const getUsernameById = (userId: number) => `${getHostname()}/user/get/usernameById/${userId}`
export const getMe = () => `${getHostname()}/user/get/me`