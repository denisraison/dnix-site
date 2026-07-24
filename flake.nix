{
  description = "dnix.io — terminal landing page. No build step; the source is the artifact.";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forEach = f: nixpkgs.lib.genAttrs systems (system: f nixpkgs.legacyPackages.${system});
    in
    {
      devShells = forEach (pkgs: {
        default = pkgs.mkShell {
          packages = [ pkgs.wrangler pkgs.python3 pkgs.typescript ];
        };
      });

      # nix flake check — strict-mode typecheck of the served source (JSDoc types)
      checks = forEach (pkgs: {
        types = pkgs.runCommand "tsc-noemit" { } ''
          cd ${self}
          ${pkgs.typescript}/bin/tsc --noEmit
          touch $out
        '';
      });

      apps = forEach (pkgs: {
        # nix run .#serve — local preview (ES modules need a server, file:// won't do)
        serve = {
          type = "app";
          program = toString (pkgs.writeShellScript "serve" ''
            exec ${pkgs.python3}/bin/python3 -m http.server 8000 --directory public
          '');
        };
        # nix run .#dev — same preview with live-reload: save a file, browser
        # refreshes. The reload snippet is injected on the fly, public/ stays clean.
        dev = {
          type = "app";
          program = toString (pkgs.writeShellScript "dev" ''
            exec ${pkgs.live-server}/bin/live-server --port 8000 public "$@"
          '');
        };
        # nix run .#deploy — ship public/ to Cloudflare Pages
        deploy = {
          type = "app";
          program = toString (pkgs.writeShellScript "deploy" ''
            exec ${pkgs.wrangler}/bin/wrangler pages deploy public --project-name dnix
          '');
        };
      });
    };
}
