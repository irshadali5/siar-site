class SiarCli < Formula
  desc "Survivable Identity & Autonomous Routing - Terminal Node"
  homepage "https://siar.irshad.org.in"
  version "0.1.0"

  if OS.mac? && Hardware::CPU.arm?
    url "https://github.com/irshadali5/siar/releases/download/v0.1.0/siar-cli-v0.1.0-aarch64-apple-darwin.tar.gz"
    sha256 "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  elsif OS.mac? && Hardware::CPU.intel?
    url "https://github.com/irshadali5/siar/releases/download/v0.1.0/siar-cli-v0.1.0-x86_64-apple-darwin.tar.gz"
    sha256 "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb"
  end

  def install
    bin.install "siar-cli"
    bin.install_symlink "siar-cli" => "siar"
  end

  test do
    assert_match "SIAR Terminal Node", shell_output("#{bin}/siar-cli --version")
  end
end
