import { envs, connectDB } from "./src/config";
import app from "./src/app";

const PORT = envs.PORT || 3000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is listening on port ${PORT}`);
});
