import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle,
  Clock,
  Hospital,
  Phone,
  RefreshCw,
} from "lucide-react";

import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";

function FollowUps() {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    let unsubscribeFollowUps = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setUserId(null);
        setFollowUps([]);
        setLoading(false);
        return;
      }

      setUserId(user.uid);
      setLoading(true);

      const followUpsRef = collection(db, "followUps");

      unsubscribeFollowUps = onSnapshot(
        followUpsRef,
        (snapshot) => {
          const firebaseFollowUps = [];

         snapshot.forEach((followUpDoc) => {
  const data = followUpDoc.data();

  const belongsToUser =
    data.patientId === user.uid ||
    data.patientUid === user.uid ||
    data.uid === user.uid;

  if (!belongsToUser) {
    return;
  }

  firebaseFollowUps.push({
    id: followUpDoc.id,
    patientId: data.patientId || user.uid,
    patientUid: data.patientUid || user.uid,
    patient: data.patient || "Patient",
    age: data.age || "",
    village: data.village || "",
    mobile: data.mobile || data.phone || "",
    type: data.type || "Follow-up",
    title: data.title || "Follow-up Appointment",
    description:
      data.description ||
      "Please contact your healthcare worker for more information.",
    date: data.date || "Date not available",
    status: data.status || "Pending",
    priority: data.priority || "Normal",
    hospital: data.hospital || "",
    referralId: data.referralId || "",
  });
});   // ← THIS MUST BE HERE

setFollowUps(firebaseFollowUps);
setLoading(false);
        },
        (error) => {
          console.error(
            "Error loading follow-ups from Firebase:",
            error
          );

          setFollowUps([]);
          setLoading(false);
        }
      );
    });

    return () => {
      unsubscribeAuth();

      if (unsubscribeFollowUps) {
        unsubscribeFollowUps();
      }
    };
  }, []);

  const updateStatus = async (followUp, newStatus) => {
    const previousFollowUps = [...followUps];

    setFollowUps((current) =>
      current.map((item) =>
        item.id === followUp.id
          ? {
              ...item,
              status: newStatus,
            }
          : item
      )
    );

    try {
      const followUpRef = doc(db, "followUps", followUp.id);

      await updateDoc(followUpRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(
        "Unable to update follow-up status:",
        error
      );

      setFollowUps(previousFollowUps);

      alert(
        "Unable to update the follow-up. Please try again."
      );
    }
  };

  const callWorker = (mobile) => {
    if (!mobile) {
      alert(
        "Healthcare worker contact number is not available."
      );
      return;
    }

    window.location.href = "tel:" + mobile;
  };

  const pendingCount = followUps.filter(
    (item) =>
      String(item.status).toLowerCase() === "pending"
  ).length;

  const completedCount = followUps.filter(
    (item) =>
      String(item.status).toLowerCase() === "completed"
  ).length;

  const referralCount = followUps.filter(
    (item) =>
      String(item.type)
        .toLowerCase()
        .includes("referral") || item.referralId
  ).length;

  const getStatusClass = (status) => {
    if (String(status).toLowerCase() === "completed") {
      return "bg-green-100 text-green-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  if (!userId && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-4xl">
          <button
            onClick={() => window.history.back()}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800">
              Please log in
            </h2>

            <p className="mt-2 text-gray-500">
              Please log in to view your follow-ups.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <RefreshCw size={16} />
            Firebase Connected
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <section className="mb-8 rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
                Patient Care
              </p>

              <h1 className="text-3xl font-bold text-gray-900">
                My Follow-ups
              </h1>

              <p className="mt-2 max-w-2xl text-gray-600">
                Keep track of your upcoming healthcare
                follow-ups, appointments and care
                instructions.
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 p-5">
              <CalendarClock
                size={42}
                className="text-blue-600"
              />
            </div>
          </div>
        </section>

        <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">
                Pending
              </span>

              <Clock
                size={22}
                className="text-yellow-600"
              />
            </div>

            <p className="text-3xl font-bold text-gray-900">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">
                Completed
              </span>

              <CheckCircle
                size={22}
                className="text-green-600"
              />
            </div>

            <p className="text-3xl font-bold text-gray-900">
              {completedCount}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">
                Referrals
              </span>

              <Hospital
                size={22}
                className="text-purple-600"
              />
            </div>

            <p className="text-3xl font-bold text-gray-900">
              {referralCount}
            </p>
          </div>
        </section>

        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-gray-900">
              Upcoming Follow-ups
            </h2>

            <p className="mt-1 text-gray-500">
              Your healthcare follow-up schedule
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <RefreshCw
                size={28}
                className="mx-auto mb-3 animate-spin text-blue-600"
              />

              <p className="text-gray-600">
                Loading your follow-ups...
              </p>
            </div>
          ) : followUps.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <CalendarClock
                size={48}
                className="mx-auto mb-4 text-gray-300"
              />

              <h3 className="text-xl font-semibold text-gray-800">
                No Follow-ups
              </h3>

              <p className="mt-2 text-gray-500">
                You currently have no follow-up appointments.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {followUps.map((followUp) => (
                <article
                  key={followUp.id}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                            followUp.status
                          )}`}
                        >
                          {followUp.status || "Pending"}
                        </span>

                        {followUp.priority && (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                            {followUp.priority}
                          </span>
                        )}

                        {followUp.type && (
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                            {followUp.type}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-gray-900">
                        {followUp.title}
                      </h3>

                      <p className="mt-2 text-gray-600">
                        {followUp.description}
                      </p>

                      <div className="mt-5 grid grid-cols-1 gap-3 text-sm text-gray-600 md:grid-cols-2">
                        <div className="flex items-center gap-2">
                          <CalendarClock
                            size={18}
                            className="text-blue-600"
                          />

                          <span>
                            <strong>Date:</strong>{" "}
                            {followUp.date}
                          </span>
                        </div>

                        {followUp.hospital && (
                          <div className="flex items-center gap-2">
                            <Hospital
                              size={18}
                              className="text-purple-600"
                            />

                            <span>
                              <strong>Hospital:</strong>{" "}
                              {followUp.hospital}
                            </span>
                          </div>
                        )}

                        {followUp.village && (
                          <div className="flex items-center gap-2">
                            <span>
                              <strong>Village:</strong>{" "}
                              {followUp.village}
                            </span>
                          </div>
                        )}

                        {followUp.mobile && (
                          <div className="flex items-center gap-2">
                            <Phone
                              size={18}
                              className="text-green-600"
                            />

                            <span>
                              <strong>Contact:</strong>{" "}
                              {followUp.mobile}
                            </span>
                          </div>
                        )}
                      </div>

                      {followUp.referralId && (
                        <p className="mt-4 text-sm text-gray-500">
                          Referral ID: {followUp.referralId}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-3 lg:min-w-[180px]">
                      {String(followUp.status).toLowerCase() !==
                        "completed" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              followUp,
                              "Completed"
                            )
                          }
                          className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700"
                        >
                          <CheckCircle size={18} />
                          Mark Completed
                        </button>
                      )}

                      {String(followUp.status).toLowerCase() ===
                        "completed" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              followUp,
                              "Pending"
                            )
                          }
                          className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-200"
                        >
                          <RefreshCw size={18} />
                          Mark Not Completed
                        </button>
                      )}

                      <button
                        onClick={() =>
                          callWorker(followUp.mobile)
                        }
                        className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 font-semibold text-blue-700 transition hover:bg-blue-100"
                      >
                        <Phone size={18} />
                        Contact
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Connected Care Journey
          </h2>

          <p className="mt-2 text-gray-600">
            Your follow-ups help your healthcare team continue
            monitoring your care and progress.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-blue-50 px-4 py-2 font-medium text-blue-700">
              Consultation
            </span>

            <span className="text-gray-400">→</span>

            <span className="rounded-full bg-purple-50 px-4 py-2 font-medium text-purple-700">
              Treatment
            </span>

            <span className="text-gray-400">→</span>

            <span className="rounded-full bg-yellow-50 px-4 py-2 font-medium text-yellow-700">
              Follow-up
            </span>

            <span className="text-gray-400">→</span>

            <span className="rounded-full bg-green-50 px-4 py-2 font-medium text-green-700">
              Continued Care
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default FollowUps