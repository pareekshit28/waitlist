import { useState } from "react";
import { db } from "./firebase";
import { addDoc, collection, getCountFromServer } from "firebase/firestore";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

function App() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [landing, setLanding] = useState(true);
  const [count, setCount] = useState(0);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const { width, height } = useWindowSize();

  const submit = async (e) => {
    e.preventDefault();
    if (
      email == null ||
      email === undefined ||
      email === "" ||
      !emailRegex.test(email)
    ) {
      setError("Please enter a valid email!");
      return;
    }

    try {
      // Add email to 'emails' collection in Firestore
      await addDoc(collection(db, "emails"), { email });
      setEmail(""); // Clear the input field
      setLanding(false);
      const snapshot = await getCountFromServer(collection(db, "emails"));
      setCount(snapshot.data().count); // Update the count with the number of documents
    } catch (error) {
      console.error("Error adding email to Firestore:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen p-6">
      {landing === true ? (
        <div className="flex flex-col justify-center items-start">
          <text className="text-2xl mb-6">
            Hello 👋
            <br />
            Thank You for showing interest in
            <text className=" font-bold"> Sky Portal</text>
          </text>
          <text className="text-xl mb-1">1. Please provide your Email</text>
          <text>(We'll send you an email with the download link 🔗😉)</text>
          <input
            type="email"
            placeholder="Enter Email"
            className="border-b-2 border-gray-300 focus:outline-none focus:border-gray-500 pt-4 mb-1 w-full"
            value={email}
            onChange={(e) => {
              setError("");
              setEmail(e.target.value);
            }}
          />
          <text className="mb-4 text-red-500 text-sm">{error}</text>
          <button
            type="submit"
            className="bg-black text-white font-semibold py-2 px-4 rounded"
            onClick={submit}
          >
            Submit
          </button>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <Confetti width={width} height={height} />
          <text className="text-2xl mb-1">
            Hurray you are in the waitlist! 🥳
          </text>
          <text className="text-xl">
            Current Position:
            <text className=" bg-black text-white p-1 m-1 rounded-full">
              #{count}
            </text>
          </text>
        </div>
      )}
    </div>
  );
}

export default App;
