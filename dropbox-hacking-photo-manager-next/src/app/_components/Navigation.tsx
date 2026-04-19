// import SamePageLink from "@components/samePageLink";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
// import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import { alpha, styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "22ch",
      "&:focus": {
        width: "50ch",
      },
    },
  },
}));

const Navigation = (): React.ReactElement | null => (
  <AppBar position="static">
    <Toolbar variant="dense">
      {/* <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
        <MenuIcon />
      </IconButton> */}
      <Typography
        variant="h6"
        component="div"
        sx={{
          color: "inherit",
          mr: 6,
        }}
      >
        DPM-Next
      </Typography>
      <Typography
        variant="overline"
        component="a"
        href="/next-gen/list-of-days/without-samples"
        sx={{
          color: "inherit",
          mr: 2,
        }}
      >
        Days
      </Typography>
      <Typography
        variant="overline"
        component="a"
        href="/next-gen/video"
        sx={{
          color: "inherit",
          mr: 2,
        }}
      >
        Video
      </Typography>
      <Typography
        variant="overline"
        component="a"
        href="/next-gen/tags"
        sx={{
          color: "inherit",
          mr: 2,
        }}
      >
        Tags
      </Typography>
      <Typography
        variant="overline"
        component="a"
        href="/next-gen/search"
        sx={{
          color: "inherit",
          mr: 6,
        }}
      >
        Search
      </Typography>
      <Typography
        variant="overline"
        component="a"
        href="/next-gen/stats"
        sx={{
          color: "inherit",
          mr: 2,
        }}
      >
        Stats
      </Typography>
      <Typography
        variant="overline"
        component="a"
        href="/next-gen/exif-explorer"
        sx={{
          color: "inherit",
          mr: 2,
        }}
      >
        EXIF Explorer
      </Typography>
      <Typography
        variant="overline"
        component="a"
        href="/next-gen/mediainfo-explorer/null"
        sx={{
          color: "inherit",
          mr: 4,
        }}
      >
        MediaInfo Explorer
      </Typography>
      <Search sx={{ mr: 2 }}>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
        />
      </Search>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
        onClick={() =>
          void document.body.requestFullscreen({ navigationUI: "show" })
        }
      >
        <FullscreenIcon />
      </IconButton>
    </Toolbar>
  </AppBar>
);

export default Navigation;
