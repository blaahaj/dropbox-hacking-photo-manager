import FullscreenIcon from "@mui/icons-material/Fullscreen";
import SearchIcon from "@mui/icons-material/Search";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import { alpha, styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Link } from "react-router";

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
        <Link to="/">DPM-RR</Link>
      </Typography>
      <Typography
        variant="overline"
        component="div"
        sx={{
          color: "inherit",
          mr: 2,
        }}
      >
        <Link to="/days">Days</Link>
      </Typography>
      <Typography
        variant="overline"
        component="div"
        sx={{
          color: "inherit",
          mr: 2,
        }}
      >
        <Link to="/video">Video</Link>
      </Typography>
      <Typography
        variant="overline"
        component="div"
        sx={{
          color: "inherit",
          mr: 2,
        }}
      >
        <Link to="/tags">Tags</Link>
      </Typography>
      <Typography
        variant="overline"
        component="div"
        sx={{
          color: "inherit",
          mr: 2,
        }}
      >
        <Link to="/search">Search</Link>
      </Typography>
      <Typography
        variant="overline"
        component="div"
        sx={{
          color: "inherit",
          mr: 6,
        }}
      >
        <Link to="/search/experiment">Experimental</Link>
      </Typography>
      <Typography
        variant="overline"
        component="div"
        sx={{
          color: "inherit",
          mr: 2,
        }}
      >
        <Link to="/stats">Stats</Link>
      </Typography>
      <Typography
        variant="overline"
        component="div"
        sx={{
          color: "inherit",
          mr: 2,
        }}
      >
        <Link to="/exif-explorer">EXIF Explorer</Link>
      </Typography>
      <Typography
        variant="overline"
        component="div"
        sx={{
          color: "inherit",
          mr: 4,
        }}
      >
        <Link to="/mediainfo-explorer/null">MediaInfo Explorer</Link>
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
