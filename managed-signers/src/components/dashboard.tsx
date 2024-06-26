/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/CeyDlkE8vYS
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import DashboardButton from "@/components/dashboard-button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { DEFAULT_CAST } from "@/constants";
import fetcher from "@/lib/fetcher";
import { cn } from "@/lib/utils";
import { CastWithInteractions } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import axios from "axios";
import {
  MessageCircleIcon,
  PencilIcon,
  PictureInPicture2Icon,
  RefreshCw,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";

export function Dashboard() {
  const { data } = useSWR<any[]>("/api/users", fetcher);
  const { toast } = useToast();

  const [selectedAccount, setSelectedAccount] = useState<string>();

  const [text, setText] = useState<string>("");
  const [embedUrl, setEmbedUrl] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [pfpUrl, setPfpUrl] = useState<string>("");
  const [replyTo, setReplyTo] = useState<string>("");
  const [isCasting, setIsCasting] = useState<boolean>(false);
  const [isDeletingCast, setIsDeletingCast] = useState<boolean>(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState<boolean>(false);
  const [isLikeAndRecasting, setIsLikeAndRecasting] = useState<boolean>(false);
  const [deleteCastHash, setDeleteCastHash] = useState<string>("");
  const [likeAndRecastURL, setLikeAndRecastURL] = useState<string>("");

  const { data: ogData } = useSWR<{
    title: string;
    description: string;
    image: string;
  }>(
    !embedUrl.includes("warpcast.com") ? "/api/og?url=" + embedUrl : null,
    fetcher
  );

  const { data: castData } = useSWR<CastWithInteractions>(
    embedUrl.includes("warpcast.com") ? "/api/cast?url=" + embedUrl : null,
    fetcher
  );

  const handleDeleteCast = async () => {
    setIsDeletingCast(true);
    try {
      const response = await axios.post("/api/delete-cast", {
        hash: deleteCastHash,
        fid: selectedAccount,
      });
      if (response.status === 200) {
        setDeleteCastHash("");
        toast({
          title: "Cast deleted",
          description: "Your cast has been deleted",
        });
      }
    } catch (error) {
      console.error("Could not delete the cast", error);
    } finally {
      setIsDeletingCast(false);
    }
  };

  const handleCast = async () => {
    setIsCasting(true);
    const castText = text.length === 0 ? DEFAULT_CAST : text;
    try {
      const response = await axios.post("/api/cast", {
        embed: embedUrl,
        text: castText,
        fid: selectedAccount,
        replyTo,
      });
      if (response.status === 200) {
        setText(""); // Clear the text field
        toast({
          title: "Cast sent",
          description: "Your cast has been sent",
        }); // Show the toast
      }
    } catch (error) {
      console.error("Could not send the cast", error);
    } finally {
      setIsCasting(false); // Re-enable the button
    }
  };

  const handleUpdateProfile = async () => {
    setIsUpdatingProfile(true);
    try {
      const response = await axios.post("/api/update-profile", {
        bio,
        pfpUrl,
        fid: selectedAccount,
      });
      if (response.status === 200) {
        setBio("");
        setPfpUrl("");
        toast({
          title: "Profile updated",
          description: "Your profile has been updated",
        });
      }
    } catch (error) {
      console.error("Could not update the profile", error);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleLikeAndRecast = async () => {
    setIsLikeAndRecasting(true);
    try {
      const response = await axios.post("/api/recast-like", {
        url: likeAndRecastURL,
        fid: selectedAccount,
      });
      if (response.status === 200) {
        setLikeAndRecastURL("");
        toast({
          title: "Cast recasted and liked",
          description: "Your cast has been recasted and liked",
        });
      }
    } catch (error) {
      console.error("Could not like and recast", error);
    } finally {
      setIsLikeAndRecasting(false);
    }
  };

  useEffect(() => {
    if (data) {
      setSelectedAccount(data[0].fid.toString());
    }
  }, [data]);

  const account = data?.find((user) => user.fid.toString() === selectedAccount);

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="border-b border-b-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* <Link
              className="text-gray-900 dark:text-gray-100 shrink-0 font-medium text-2xl"
              href="#"
            >
              🦢 Castfully
            </Link> */}
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger className="h-14 w-56">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {data?.map((user) => (
                  <SelectItem key={user.fid} value={user.fid.toString()}>
                    <div className="flex px-1 items-center">
                      <Avatar
                        className={cn(
                          "w-6 h-6 rounded-full mr-4",
                          user.fid.toString() === selectedAccount
                            ? "outline outline-offset-2 outline-amber-500"
                            : ""
                        )}
                      >
                        <AvatarImage src={user.pfp_url} />
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <p className="font-medium">{user.display_name}</p>
                        <p className="text-gray-500 text-xs">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-col">
              <p className="text-xs">
                <span className="font-bold">{account?.follower_count}</span>{" "}
                followers
              </p>
              <p className="text-xs">
                <span className="font-bold">{account?.following_count}</span>{" "}
                following
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* <Button variant="ghost">
              <BellIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </Button>
            <Button variant="ghost">
              <SearchIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </Button> */}
          </div>
        </div>
      </header>
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="inline-flex items-center space-x-2">
                <MessageCircleIcon size={24} className="mr-1" /> Cast
              </CardTitle>
              <CardDescription>Cast to Farcaster</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  className="resize-none"
                  placeholder="Your text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <Input
                  className="resize-none"
                  placeholder="Image or quote URL"
                  value={embedUrl}
                  onChange={(e) => setEmbedUrl(e.target.value)}
                />
                <Input
                  className="resize-none"
                  placeholder="Reply cast URL (optional)"
                  value={replyTo}
                  onChange={(e) => setReplyTo(e.target.value)}
                />
                <div className="flex justify-end">
                  <DashboardButton onClick={handleCast} isLoading={isCasting}>
                    Cast
                  </DashboardButton>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="inline-flex items-center space-x-2">
                <PictureInPicture2Icon size={24} className="mr-1" /> Preview
                Embed
              </CardTitle>
              <CardDescription>Preview the embed</CardDescription>
            </CardHeader>
            <CardContent>
              {ogData && (
                <>
                  <img src={ogData.image} />
                  <p>{ogData.title}</p>
                  <p className="text-xs">{ogData.description}</p>
                </>
              )}
              {castData && (
                <>
                  <div className="flex items-center space-x-2">
                    <img
                      src={castData.author.pfp_url}
                      className="w-6 h-6 rounded-full"
                    />
                    <p className="text-xs">{castData.author.display_name}</p>
                  </div>
                  <p>{castData.text}</p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="inline-flex items-center space-x-2">
                <RefreshCw size={24} className="mr-1" /> Recast & Like
              </CardTitle>
              <CardDescription>
                Recast a previous cast & like it
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  className="resize-none"
                  placeholder="Cast URL to recast and like"
                  value={likeAndRecastURL}
                  onChange={(e) => setLikeAndRecastURL(e.target.value)}
                />
                <div className="flex justify-end">
                  <DashboardButton
                    onClick={handleLikeAndRecast}
                    isLoading={isLikeAndRecasting}
                  >
                    Recast and like
                  </DashboardButton>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="inline-flex items-center space-x-2">
                <Trash2Icon size={24} className="mr-1" /> Delete cast
              </CardTitle>
              <CardDescription>Delete a cast</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  className="resize-none"
                  placeholder="Cast URL to delete"
                  value={deleteCastHash}
                  onChange={(e) => setDeleteCastHash(e.target.value)}
                />
                <div className="flex justify-end">
                  <DashboardButton
                    onClick={handleDeleteCast}
                    isLoading={isDeletingCast}
                  >
                    Delete
                  </DashboardButton>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="inline-flex items-center space-x-2">
                <PencilIcon size={24} className="mr-1" /> Edit Profile
              </CardTitle>
              <CardDescription>Edit your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  className="resize-none"
                  placeholder="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
                <Input
                  className="resize-none"
                  placeholder="Profile picture URL"
                  value={pfpUrl}
                  onChange={(e) => setPfpUrl(e.target.value)}
                />
                <div className="flex justify-end">
                  <DashboardButton
                    onClick={handleUpdateProfile}
                    isLoading={isUpdatingProfile}
                  >
                    Update
                  </DashboardButton>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
