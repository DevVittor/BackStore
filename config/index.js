module.exports = {
    secret:process.env.NODE_ENV === "production" ? process.env.SECRET : "FJWEN9324NEWJKDN912FNWEJHRFJWER92312",
    api:process.env.NODE_ENV === "production" ? "fewkrfmdwe" : "http://localhost:3001/",
    loja: process.env.NODE_ENV === "production" ? "fewkrfmdwe" : "http://localhost:8000/"
};