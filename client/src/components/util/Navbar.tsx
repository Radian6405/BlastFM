import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { user } from "../../util/interfaces";

const pages = [
  { text: "Playlists", to: "/playlists" },
  { text: "Albums", to: "/albums" },
  { text: "Songs", to: "/songs" },
  { text: "My Listening", to: "/my-listening" },
];

function Navbar({ user }: { user: user | null }) {
  const navigate = useNavigate();
  const [, , removeCookie] = useCookies(["token"]);

  const settings = [
    {
      text: "Logout",
      function: () => {
        removeCookie("token");
        navigate("/logout");
        console.log("logged out");
      },
    },
    {
      text: "Sync data",
      function: () => {
        console.log("synced data");
      },
    },
  ];

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "rgba(var(--background))",
        color: "rgba(var(--text))",
      }}
    >
      <Container maxWidth="xl" className="px-16 py-2" disableGutters>
        <Toolbar
          disableGutters
          sx={{ justifyContent: "space-between" }}
          className="gap-5"
        >
          <Link to={"/"} className="hidden md:flex">
            <Typography
              variant="h3"
              noWrap
              sx={{
                mr: 2,
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              BlastFM
            </Typography>
          </Link>

          {
            //left menu for phones
            user !== null && user.is_spotify_connected && (
              <Box sx={{ flexGrow: 0 }} className="block md:hidden">
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  className="block md:hidden"
                >
                  {pages.map((page, i) => (
                    <Link to={page.to} key={i}>
                      <MenuItem onClick={handleCloseNavMenu}>
                        <Typography sx={{ textAlign: "center" }}>
                          {page.text}
                        </Typography>
                      </MenuItem>
                    </Link>
                  ))}
                </Menu>
              </Box>
            )
          }

          <Link to={"/"} className="flex md:hidden">
            <Typography
              variant="h3"
              noWrap
              sx={{
                mr: 2,
                flexGrow: 1,
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              BlastFM
            </Typography>
          </Link>
          {
            //page buttons & avatar
            user !== null && user.is_spotify_connected && (
              <>
                <Box
                  sx={{ flexGrow: 1, color: "rgba(var(--text))" }}
                  className="hidden gap-2 md:flex"
                >
                  {pages.map((page, i) => (
                    <Link to={page.to} key={i}>
                      <Button
                        onClick={handleCloseNavMenu}
                        sx={{
                          my: 2,
                          display: "block",
                          fontSize: 16,
                          color: "rgba(var(--text))",
                        }}
                      >
                        {page.text}
                      </Button>
                    </Link>
                  ))}
                </Box>
              </>
            )
          }

          {user !== null && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="User options">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting, i) => (
                  <MenuItem
                    key={i}
                    onClick={() => {
                      setting.function();
                      handleCloseUserMenu();
                    }}
                    sx={{ color: "rgba(var(--background))" }}
                  >
                    <Typography sx={{ textAlign: "center" }}>
                      {setting.text}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
