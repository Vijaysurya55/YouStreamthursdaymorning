// import React, { useEffect, useState } from 'react';
// import Box from '@mui/material/Box';
// import Drawer from '@mui/material/Drawer';
// import List from '@mui/material/List';
// import Divider from '@mui/material/Divider';
// import ListItem from '@mui/material/ListItem';
// import ListItemText from '@mui/material/ListItemText';
// import { Avatar, Typography } from '@mui/material';
// import MenuIcon from "@mui/icons-material/Menu";
// import { IconButton } from '@mui/material';
// import logo from "../assets/YouStream.jpg";
// import { Stack } from '@mui/material';
// import { fetchCategories } from "../api/youtubeApi";
// import { useDispatch } from "react-redux";
// import { setSelectedCategory } from "../redux/category/categoryActions";
// import { useNavigate } from "react-router-dom";

// interface Props {
//   open: boolean;
//   onClose: () => void;
// }

// const SideDrawer = ({ open, onClose }: Props) => {
//   const [categories, setCategories] = useState<string[]>([]);
//   const dispatch = useDispatch<any>();
//   const navigate = useNavigate();

//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         const categories = await fetchCategories();
//         if (!mounted) return;
//         const assignableCategories =  categories.filter((category: any) => category?.snippet?.assignable) ;
//         const maxItems = 10;
//         const list = assignableCategories.slice(0, maxItems).map((category: any) => ({
//           id: category.id,
//           title: category.snippet?.title ?? "Unknown",
//         }));
//         setCategories(list);
//       } catch (err) {
//         console.warn("Failed fetching categories", err);
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   const handleClickCategory = (id: string, title: string) => {
//     dispatch(setSelectedCategory(id || null, title || null));
//     onClose();
//     navigate("/", { replace: true });
//   };

//   return (
//     <div>
//       <Drawer
//         anchor="left"
//         open={open}
//         onClose={onClose}
//         PaperProps={{
//           sx: {
//             background: "white",
//             backdropFilter: "blur(12px)",
//             color: "black",
//           },
//         }}
//       >
//         <Box
//           sx={{
//             width: { xs: "70vw", sm: "40vw", md: "20vw" },
//             display: "flex",
//             flexDirection: "column",
//             height: "100%",
//             flexWrap: 'nowrap'
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: 1.3,
//               justifyContent: "space-around",
//               p: 2,
//             }}
//           >
//             <IconButton onClick={onClose} size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 1 }}>
//               <MenuIcon />
//             </IconButton>
//             <Stack direction={'row'} gap={0.5} justifyContent={'center'} alignItems={'center'}>
//               <Avatar src={logo} alt="YouStream logo" sx={{ width: 50, height: 50 }} />
//               <Typography variant="h6" sx={{ fontWeight: "bold", color: 'black' }}>YouStream</Typography>
//             </Stack>
//           </Box>

//           <Divider sx={{ borderColor: "lightgrey"}} />

//           <List>
//             <ListItem
//               sx={{ "&:hover": { backgroundColor: "lightgrey" }, transition: "0.3s", cursor: 'pointer' }}
//               onClick={() => { onClose(); }}
//             >
//               <ListItemText primary="Favorites" />
//             </ListItem>
//           </List>

//           <Divider sx={{ borderColor: "lightgrey" }} variant='middle' />

//           <Typography variant="subtitle2" sx={{ textAlign: "center", mt: 1,mb:1, letterSpacing: 1.5 }}>
//             EXPLORE
//           </Typography>
//           <Divider sx={{ borderColor: "lightgrey" }} variant='middle' />


//           <List>
//             {categories.map((cat: any) => (
//               <ListItem
//                 key={cat.id}
//                 sx={{ "&:hover": { backgroundColor: "lightgrey" }, transition: "0.3s", cursor: 'pointer' }}
//                 onClick={() => handleClickCategory(cat.id, cat.title)}
//               >
//                 <ListItemText primary={cat.title} />
                
//               </ListItem>
//             ))}
            
//           </List>
//         </Box>
//       </Drawer>
//     </div>
//   );
// };

// export default SideDrawer;


// src/Components/SideDrawer.tsx
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Avatar, Typography, Button, Stack } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import logo from "../assets/YouStream.jpg";
import { fetchCategories } from "../api/youtubeApi";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCategory } from "../redux/category/categoryActions";
import { useNavigate, Link } from "react-router-dom";
import type { RootState } from "../redux/rootReducer";
import { signOutAll } from "../redux/auth/authThunk";

interface Props {
  open: boolean;
  onClose: () => void;
}

const SideDrawer = ({ open, onClose }: Props) => {
  const [categories, setCategories] = useState<{ id: string; title: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const auth = useSelector((s: RootState) => s.auth);
  const user = auth?.user;

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const categories = await fetchCategories();
        if (!mounted) return;
        const assignableCategories = Array.isArray(categories)
          ? categories.filter((category: any) => category?.snippet?.assignable)
          : [];
        const maxItems = 12;
        const list = assignableCategories.slice(0, maxItems).map((category: any) => ({
          id: category.id,
          title: category.snippet?.title ?? "Unknown",
        }));
        setCategories(list);
      } catch (err) {
        console.warn("Failed fetching categories", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleClickCategory = (id: string, title: string) => {
    dispatch(setSelectedCategory(id || null, title || null));
    onClose();
    navigate("/", { replace: true });
  };

  const handleLogout = async () => {
    try {
      await dispatch(signOutAll());
    } catch (e) {
      console.error("logout failed", e);
    } finally {
      onClose();
      navigate("/", { replace: true });
    }
  };

  const avatarLabel = user?.name || user?.email || "";

  return (
    <div>
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            // use fixed pixel widths for consistent appearance
            width: { xs: 260, sm: 320, md: 360 },
            background: "white",
            backdropFilter: "blur(6px)",
            color: "black",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            px: 2,
            py: 1.25,
          }}
        >
          {/* top header with logo + name and greeting/logout */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar src={logo} alt="YouStream" sx={{ width: 42, height: 42 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  YouStream
                </Typography>
              </Box>

              {/* small close icon to also dismiss drawer (keeps familiarity) */}
              <IconButton onClick={onClose} size="small" aria-label="close">
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Greeting + auth action */}
            <Box>
              {user ? (
                <Stack spacing={0.3}>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    Hi {user.name ? user.name.split(" ")[0] : user.email}
                  </Typography>
                  <Button
                    onClick={handleLogout}
                    size="small"
                    sx={{
                      textTransform: "none",
                      color: "primary.main",
                      p: 0,
                      minWidth: 0,
                    }}
                  >
                    LOGOUT
                  </Button>
                </Stack>
              ) : (
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  size="small"
                  onClick={onClose}
                >
                  Login
                </Button>
              )}
            </Box>
          </Box>

          <Divider sx={{ borderColor: "lightgrey", mb: 1 }} />

          {/* Favorites */}
          <List sx={{ mb: 1 }}>
            <ListItem
              sx={{
                px: 0,
                py: 1,
                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                transition: "0.2s",
                cursor: "pointer",
              }}
              onClick={() => {
                onClose();
                // keep placeholder behavior (you can navigate to /favorites if you implement it)
              }}
            >
              <ListItemText primary="Favorites" primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItem>
          </List>

          <Divider sx={{ borderColor: "lightgrey", mb: 1 }} />

          <Typography
            variant="subtitle2"
            sx={{
              textAlign: "center",
              mb: 1,
              letterSpacing: 1.5,
              color: "rgba(0,0,0,0.6)",
            }}
          >
            EXPLORE
          </Typography>

          {/* Category list - scrollable area */}
          <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
            <List>
              {loading && (
                <ListItem>
                  <ListItemText primary="Loading..." />
                </ListItem>
              )}

              {!loading &&
                categories.map((cat) => (
                  <ListItem
                    key={cat.id}
                    sx={{
                      px: 0,
                      py: 1,
                      "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                      transition: "0.15s",
                      cursor: "pointer",
                    }}
                    onClick={() => handleClickCategory(cat.id, cat.title)}
                  >
                    <ListItemText primary={cat.title} />
                  </ListItem>
                ))}

              {!loading && categories.length === 0 && (
                <ListItem>
                  <ListItemText primary="No categories found" />
                </ListItem>
              )}
            </List>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
};

export default SideDrawer;
