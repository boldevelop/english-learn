const getProgressByCompId = (progress, id) => progress.filter(p => p.compId === id)[0]
const getProgressBySongId = (progressComp, id) => progressComp.filter(p => p.songId === id)[0]
export const getCompleteTasksOfComp = (progress, id) => getProgressByCompId(progress, id).completeTasksIds
export const getCompleteTasksOfSong = (progress, compId, songId) => getProgressBySongId(
    getProgressByCompId(progress, compId).songs,
    songId
).completeTasksIds