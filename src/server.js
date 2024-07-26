let Server;

if (process.env.NODE_ENV === "production") {
  Server = "https://chatbot-burgerking-aqhd.vercel.app/api/chat";
} else {
  Server = "http://localhost:5001/api/chat";
}
export default Server;  