"use client";
import { SetStateAction, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Dropdown } from "flowbite-react";

const Page = () => {
  const { data: session }: any = useSession();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState();
  const [repos, setRepos] = useState([]);
  const [pages, setPages] = useState(0);
  const [repoNumber, setRepoNumber] = useState(1);
  const [repoShown, setRepoShown] = useState([]);
  const [userTags, setUserTags] = useState<any>([]);
  const [isButtonDisabled, setButtonDisabled] = useState(true);
  const [userHackathons, setUserHackathons] = useState([]);
  const [ongoingHackathons, setOngoingHackathons] = useState(false);
  const [closedHackathons, setClosedHackathons] = useState(false);

  const formatTimeDifference = (updated_at: string | number | Date) => {
    const currentTime = new Date();
    const updatedAtTime = new Date(updated_at);
    const timeDifference = (currentTime as any) - (updatedAtTime as any);

    // Convert the time difference to seconds
    const secondsDifference = Math.floor(timeDifference / 1000);

    // You can format the time difference according to your needs
    if (secondsDifference < 60) {
      return `${secondsDifference} seconds ago`;
    } else if (secondsDifference < 3600) {
      const minutes = Math.floor(secondsDifference / 60);
      return `${minutes} minutes ago`;
    } else if (secondsDifference < 86400) {
      const hours = Math.floor(secondsDifference / 3600);
      return `${hours} hours ago`;
    } else {
      const days = Math.floor(secondsDifference / 86400);
      return `${days} days ago`;
    }
  };
  const getCurrentUser = async (email: any) => {
    try {
      const res = await fetch(`/api/getCurrentUser?userEmail=${email}`);
      if (!res.ok) {
        throw new Error("Failed to fetch hackathons");
      }

      return res.json();
    } catch (error) {
      console.log("Error loading hackathons: ", error);
    }
  };
  useEffect(() => {
    let url = "";
    const fetchCurrentUserData = async () => {
      try {
        const data = await getCurrentUser(session?.user.email);
        if (data) {
          setCurrentUser(data.currentUser);
          url = data.currentUser?.repo;
          setUserTags(data.currentUser?.tags);
          fetchRepoData();
          getUserHackathons(data.currentUser?.hackathon);
        }
      } catch (error) {
        console.error("Error fetching current user data: ", error);
      }
    };
    const getUserHackathons = async (arr: any) => {
      try {
        const res = await axios.post(`/api/fetchHackathonById`, arr);
        setUserHackathons(res.data.hackathons);
      } catch (error) {
        console.log("Error loading hackathons: ", error);
      }
    };
    const fetchRepoData = async () => {
      try {
        const res = await axios.get(String(url));
        setRepos(res.data);
        console.log(res.data, "66");
        if (res.data.length % 9 == 0) {
          setPages(res.data.length / 9);
        } else {
          setPages(res.data.length / 9 + 1);
        }
      } catch (error) {
        console.error("Error fetching repo data: ", error);
      }
    };
    if (session?.user?.email) {
      fetchCurrentUserData();
    }
  }, [session?.user?.email]);
  useEffect(() => {
    let tempArray: SetStateAction<never[]> = [];
    for (let i = 9 * (repoNumber - 1); i < 9 * repoNumber; i++) {
      if (repos[i] != undefined) {
        tempArray.push(repos[i]);
      }
    }
    setRepoShown(tempArray);
  }, [repoNumber, pages]);

  useEffect(() => {
    if (userHackathons) {
      const ongoing = userHackathons.filter(
        (hackathon: any) => new Date(hackathon.deadline) > new Date()
      );
      const closed = userHackathons.filter(
        (hackathon: any) => new Date(hackathon.deadline) < new Date()
      );
      if (ongoing.length > 0) {
        setOngoingHackathons(true);
      }
      if (closed.length > 0) {
        setClosedHackathons(true);
      }
    }
  }
  , [userHackathons]);

  const removeTag = (tagToRemove: any) => {
    const updatedTags = userTags.filter((tag: any) => tag !== tagToRemove);
    setUserTags(updatedTags);
    setButtonDisabled(false);
  };
  const convertDate = (inputDate: any) => {
    const date = new Date(inputDate);
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear().toString();

    return day + "/" + month + "/" + year;
  };
  const addTag = (tagToAdd: any) => {
    if (userTags.length != 2) {
      if (!userTags.includes(tagToAdd)) {
        setUserTags([...userTags, tagToAdd]);
        setButtonDisabled(false);
      } else {
        alert("Tag already present");
      }
    } else {
      alert("Only 2 tags are allowed");
    }
  };
  const handleUpdateTags = async () => {
    try {
      const response = await axios.put(
        `/api/updateTags?userEmail=${(currentUser as any)?.email}`,
        userTags
      );
      console.log("Tags updated successfully", response);
      setButtonDisabled(true);
    } catch (error) {
      console.error("Error updating tags:", error);
    }
  };

  return (
    <>
      <div className="mx-7">
        <div className="md:flex justify-evenly align-middle p-10  mb-5 ">
          <div>
            <img
              src={currentUser?.["avatar"]}
              alt="Profile Picture"
              className="rounded-[50%] xl:h-80 xl:w-80  h-60 sm:h-80  border-8 border-[rgb(30,28,74)]"
            />
            <p className="ml-10 mt-6 text-2xl">{currentUser?.["name"]}</p>
          </div>
          <div className="border-gray-600 border  rounded-lg  ">
            <p className="m-4">
              <span className="text-lg">Email: </span>
              <span className="text-sm">{currentUser?.["email"]}</span>
            </p>
            <p className="m-4">
              <span className="text-lg">Username:</span>
              <span className="text-sm"> {currentUser?.["username"]}</span>
            </p>
            <p className="m-4">
              <span className="text-lg">Link: </span>
              <span className="text-sm text-blue-600 hover:text-blue-700">{currentUser?.["link"]}</span>
            </p>
            <div className="flex gap-4 p-2">
              <div>
              <Dropdown label="Tags" dismissOnClick={false}>
                {(userTags[0] !== "Frontend" && userTags[1] !== "Frontend") ? (
                  <Dropdown.Item
                  className="bg-white"
                  onClick={() => {
                    addTag("Frontend");
                  }}
                >
                  Frontend
                </Dropdown.Item>
                ):null}
                {(userTags[1] !== "Backend" && userTags[0] !== "Backend") ? (
                  <Dropdown.Item
                  className="bg-white"
                  onClick={() => {
                    addTag("Backend");
                  }}
                >
                  Backend
                </Dropdown.Item>
                ):null}
                {(userTags[0] !== "Blockchain" && userTags[1] !== "Blockchain") ? (
                  <Dropdown.Item
                  className="bg-white"
                  onClick={() => {
                    addTag("Blockchain");
                  }}
                >
                 Blockchain
                </Dropdown.Item>
                ):null}
                {(userTags[0] !== "Full Stack" && (userTags[1] !== "Full Stack")) ? (
                  <Dropdown.Item
                  className="bg-white"
                  onClick={() => {
                    addTag("Full Stack");
                  }}
                >
                  Full Stack
                </Dropdown.Item>
                ):null}
                {(userTags[0] !== "AI & ML" && userTags[1] !== "AI & ML") ? (
                  <Dropdown.Item
                  className="bg-white"
                  onClick={() => {
                    addTag("AI & ML");
                  }}
                >
                  AI & ML
                </Dropdown.Item>
                ):null}
              </Dropdown>
              </div>
              <div className="flex flex-col gap-3 justify-start ">
                {userTags.map((u: any, i: any) => {
                  return (
                    <button
                      onClick={() => {
                        removeTag(u);
                      }}
                      className="rounded bg-red-800 px-2 py-1 "
                    >
                      {u} <span className="text-black text-base text-start pb-2">X</span>
                    </button>
                  );
                })}
              </div>
             <div>
             <button
                disabled={isButtonDisabled}
                onClick={() => {
                  handleUpdateTags();
                }}
                className={`${
                  isButtonDisabled ? "bg-red-900" : "bg-blue-900"
                } border "text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium text-base rounded-lg  px-3 py-1 border-gray-600 text-center mx-4`}
              >
                SAVE
              </button>
             </div>
            </div>
          </div>
        </div>
        
        <>
        <p>
        Ongoing
        </p>
        <div className="rounded-xl ">
          <table className="min-w-full overflow-x-auto border-gray-600 border  mb-4 rounded-xl container">
            <thead className="uppercase bg-gray-50 dark:bg-gray-700 text-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Hackathon Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Deadline
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Link
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Apply
                </th>
              </tr>
            </thead>
            {ongoingHackathons ? (
            <tbody>
              {userHackathons?.map(
                (hackathon: any, index: any) =>
                  new Date(hackathon.deadline) > new Date() && (
                    <tr key={index}>
                      <td className="py-2 px-3 text-sm">{hackathon.name}</td>
                      <td className="py-2 px-3 text-sm">
                        {convertDate(hackathon.deadline)}
                      </td>
                      <td className="py-2 px-3 text-sm">
                        <a
                          href={hackathon.link}
                          target="_blank"
                          className="text-blue-500"
                        >
                          Website
                        </a>
                      </td>
                      <td className="py-2 px-3 text-sm">
                        {hackathon.description}
                      </td>
                      <td className="py-2 px-3 text-sm">
                        <button
                          onClick={() => {
                            router.push(`/hackathon/${hackathon._id}`);
                          }}
                          className="flex flex-row w-1/2 border text-center bg-red-600 rounded-xl justify-center text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium   px-2 py-1 border-gray-600  mx-4 text-xs"
                        >
                          Visit
                        </button>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
            ) : <p className="my-4">No Ongoing hackathons</p>}
          </table>
        </div>
        </>
        
       
        <>
        <p>Closed</p>
        <table className="min-w-full overflow-x-auto border-gray-600 border  mb-7">
          <thead className="uppercase bg-gray-50 dark:bg-gray-700 text-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                Hackathon Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                Deadline
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                Link
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                Apply
              </th>
            </tr>
          </thead>
          {closedHackathons ? (
          <tbody>
            {userHackathons?.map(
              (hackathon: any, index: any) =>
                new Date(hackathon.deadline) < new Date() && (
                  <tr key={index}>
                    <td className="py-2 px-3 text-sm">{hackathon.name}</td>
                    <td className="py-2 px-3 text-sm">
                      {convertDate(hackathon.deadline)}
                    </td>
                    <td className="py-2 px-3 text-sm">
                      <a
                        href={hackathon.link}
                        target="_blank"
                        className="text-blue-500"
                      >
                        Website
                      </a>
                    </td>
                    <td className="py-2 px-3 text-sm">
                      {hackathon.description}
                    </td>
                    <td className="py-2 px-3 text-sm">
                      <button
                        onClick={() => {
                          router.push(`/hackathon/${hackathon._id}`);
                        }}
                        className="flex flex-row w-1/2 border text-center bg-red-600 rounded-xl justify-center text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium   px-2 py-1 border-gray-600  mx-4 text-xs"
                      >
                        Visit
                      </button>
                    </td>
                  </tr>
                )
            )}
          </tbody>
          ) : <p className="my-4">No Closed hackathons</p>}
        </table>
        </>
        
        
        <div className="flex flex-col">
          <div className="flex flex-row">
            {Array.from({ length: pages }, (_, index) => index + 1).map(
              (i, id) => {
                return (
                  <button
                    className="mx-4  border border-gray-600 px-2 rounded mb-2"
                    onClick={() => {
                      setRepoNumber(id + 1);
                    }}
                  >
                    {id + 1}
                  </button>
                );
              }
            )}
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3  grid-rows-3 lg:gap-8 gap-4 ">
            {repoShown.map((repo, i) => (
              <div className="border rounded-md px-2 py-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-blue-500 font-semibold text-sm">
                      {(repo as any)?.name}
                    </span>
                  </div>
                  <a
                    href={(repo as any)?.html_url}
                    className="flex flex-row border text-center bg-red-600 rounded-xl justify-center text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium   px-3 py-2 border-gray-600  mx-4 text-xs"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit
                  </a>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  {(repo as any)?.description || "No description available"}
                </p>
                <div className="flex items-center text-xs text-gray-600">
                  <span>{(repo as any)?.language}</span>
                  <span className="mx-2">•</span>
                  <span>{formatTimeDifference((repo as any)?.updated_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;