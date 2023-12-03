import { User } from "./App";

let users: User[] = [];

function compareJob(job: string) {
  const usersWithJob: User[] = [];
  users.forEach(user => {
    if (user.job_title === job) {
      usersWithJob.push(user);
    }
  });
  return usersWithJob;
}

self.onmessage = (e) => {
  
  if (e.data.event === "update") {
    users = e.data.users;
    return;
  }

  if (e.data.event === "compare") {
    const comparedUsers = compareJob(e.data.job);
    postMessage({ event: e.data.event, users: comparedUsers });
    return;
  }
}
