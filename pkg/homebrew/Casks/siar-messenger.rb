cask "siar-messenger" do
  version "0.1.0"
  sha256 "8f3a42c1b990e51d642cfa3017d57b66448a2f1098c3550a77e192041822910f"

  url "https://pkg.siar.irshad.org.in/releases/SIAR_Messenger-#{version}-universal.dmg"
  name "SIAR Messenger"
  desc "Zero-infrastructure, delay-tolerant mesh messaging app"
  homepage "https://siar.irshad.org.in"

  app "SIAR Messenger.app"
  binary "#{appdir}/SIAR Messenger.app/Contents/MacOS/siar-cli"

  zap trash: [
    "~/Library/Application Support/SIAR",
    "~/Library/Preferences/org.siar.messenger.plist",
  ]
end
